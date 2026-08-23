import express from "express";
import clientPromise from "../lib/mongodb.js";
import admin from "../lib/firebaseAdmin.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { token } = req.body;
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const { uid, email, name, picture } = decoded;

    const client = await clientPromise;
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

    await db.collection("users").updateOne(
      { uid },
      {
        $setOnInsert: {
          uid,
          email,
          name,
          picture,
          createdAt: new Date(),
        },
      },
      { upsert: true },
    );

    res.status(200).json({ message: "user signed up" });
  } catch (err) {
    console.error("failed to signup user", err);
    res.status(401).json({ error: "invalid token" });
  }
});

router.put("/updateUser/:uid", async (req, res) => {
  const { uid } = req.params;
  const { picture, name, bio } = req.body;
  try {
    const client = await clientPromise;
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

    await db.collection("users").updateOne(
      { uid },
      {
        $set: {
          name,
          picture,
          bio,
          updatedAt: new Date(),
        },
      },
    );

    res.status(200).json({ message: "user updated" });
  } catch (err) {
    console.error("failed to signup user", err);
    res.status(401).json({ error: "update failed" });
  }
});

router.delete("/deleteUser/:uid", async (req, res) => {
  try {
    const { uid } = req.params;

    const client = await clientPromise;
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

    const userData = await db.collection("users").findOne({ uid });
    const userRankings = userData?.rankings || [];

    await db.collection("users").deleteOne({ uid });
    await db.collection("messages").deleteMany({ senderId: uid });
    await db.collection("posts").deleteMany({ userId: uid });
    await db.collection("pings").deleteMany({ userId: uid });
    await db.collection("watchList").deleteMany({ userId: uid });
    await db
      .collection("posts")
      .updateMany(
        { "comments.userId": uid },
        { $pull: { comments: { userId: uid } } },
      );
    await db
      .collection("titles")
      .updateMany(
        { "reviews.userId": uid },
        { $pull: { reviews: { userId: uid } } },
      );
    await db
      .collection("posts")
      .updateMany({ energized: uid }, { $pull: { energized: uid } });
    await db
      .collection("posts")
      .updateMany({ echoed: uid }, { $pull: { echoed: uid } });
    await db
      .collection("titles")
      .updateMany({ watchCount: uid }, { $pull: { watchCount: uid } });

    for (const rankEntry of userRankings) {
      const { titleId, points } = rankEntry;
      await db.collection("titles").updateOne(
        { titleId },
        {
          $inc: { totalPoints: -points, votes: -1 },
        },
      );
    }

    res.status(200).json({ message: "user and its data deleted succesfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/sync", async (req, res) => {
  try {
    const client = await clientPromise;
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

    const users = await db.collection("users").find({}).toArray();

    let updatedUsers = 0;

    for (const user of users) {
      const watchedTitles = await db
        .collection("watchList")
        .aggregate([
          {
            $match: {
              userId: user.uid,
              watched: true,
            },
          },
          {
            $lookup: {
              from: "titles",
              localField: "titleId",
              foreignField: "titleId",
              as: "title",
            },
          },
          {
            $unwind: "$title",
          },
        ])
        .toArray();

      const watchedTitleIds = new Set(
        watchedTitles.map((item) => item.titleId),
      );

      const cleanedRankings = (user.rankings || []).filter((ranking) =>
        watchedTitleIds.has(ranking.titleId),
      );

      await db.collection("users").updateOne(
        { uid: user.uid },
        {
          $set: {
            rankings: cleanedRankings,
          },
        },
      );

      const totalWatched = watchedTitles.length;

      const totalMCUWatched = watchedTitles.filter(
        (item) => item.title.category === "mcu",
      ).length;

      const totalLegacyWatched = watchedTitles.filter(
        (item) => item.title.category === "legacy",
      ).length;

      const totalAdjacentWatched = watchedTitles.filter(
        (item) => item.title.category === "adjacent",
      ).length;

      await db.collection("users").updateOne(
        {
          uid: user.uid,
        },
        {
          $set: {
            totalWatched,
            totalMCUWatched,
            totalLegacyWatched,
            totalAdjacentWatched,
          },
        },
      );

      updatedUsers++;
    }

    res.status(200).json({
      message: "all user watch stats succesfully synced",
      updatedUsers,
    });
  } catch (err) {
    console.error("watched stats sync failed", err);

    res.status(500).json({ error: "failed to sync watch stats" });
  }
});

export default router;
