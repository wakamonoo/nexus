import express from "express";
import clientPromise from "../lib/mongodb.js";

const router = express.Router();

router.post("/watchRoute", async (req, res) => {
  try {
    const { userId, userName, title, titleId, poster } = req.body;
    const client = await clientPromise;
    const db = client.db("nexus");

    const titlesCount = await db.collection("titles").countDocuments();

    await db.collection("users").updateOne(
      {
        uid: userId,
      },
      {
        $setOnInsert: {
          totalWatched: 0,
        },
      },
      { upsert: true }
    );

    await db.collection("titles").updateOne(
      {
        titleId,
      },
      {
        $setOnInsert: {
          watchCount: [],
        },
      },
      { upsert: true }
    );

    const existing = await db
      .collection("watchList")
      .findOne({ userId, titleId });

    if (existing && existing.watched === true) {
      await db.collection("watchList").updateOne(
        {
          userId,
          titleId,
        },
        {
          $set: {
            watched: false,
            updatedAt: new Date(),
          },
        },
        { upsert: true }
      );

      await db.collection("users").updateOne({ uid: userId }, [
        {
          $set: {
            totalWatched: {
              $max: [{ $subtract: [{ $ifNull: ["$totalWatched", 0] }, 1] }, 0],
            },
          },
        },
      ]);

      await db.collection("titles").updateOne(
        {
          titleId,
        },
        { $pull: { watchCount: userId } }
      );
    } else {
      await db.collection("watchList").updateOne(
        {
          userId,
          titleId,
        },
        {
          $setOnInsert: {
            userName,
            title,
            poster,
            createdAt: new Date(),
          },
          $set: {
            watched: true,
          },
        },
        { upsert: true }
      );

      await db.collection("users").findOneAndUpdate(
        { uid: userId },
        [
          {
            $set: {
              totalWatched: { $add: [{ $ifNull: ["$totalWatched", 0] }, 1] },
            },
          },
          {
            $set: {
              vigilante: {
                $cond: [{ $gte: ["$totalWatched", 20] }, true, false],
              },
              ascendant: {
                $cond: [{ $gte: ["$totalWatched", 40] }, true, false],
              },
              cosmic: {
                $cond: [{ $gte: ["$totalWatched", titlesCount] }, true, false],
              },
            },
          },
        ],
        { upsert: true }
      );

      await db.collection("titles").updateOne(
        {
          titleId,
        },
        { $addToSet: { watchCount: userId } },
        { upsert: true }
      );
    }
    res.status(200).json({ message: `${title} marked as watched` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

export default router;
