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
    const db = client.db("nexus");

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
      { upsert: true }
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
    const db = client.db("nexus");

    await db.collection("users").updateOne(
      { uid },
      {
        $set: {
          name,
          picture,
          bio,
          updatedAt: new Date(),
        },
      }
    );

    await db.collection("posts").updateOne(
      { userId: uid },
      {
        $set: {
          userName: name,
          userImage: picture,
        },
      }
    );

    await db.collection("watchlist").updateOne(
      { userId: uid },
      {
        $set: {
          userName: name,
        },
      }
    );

    await db.collection("messages").updateOne(
      { senderId: uid },
      {
        $set: {
          sender: name,
          picture,
        },
      }
    );

    await db.collection("posts").updateMany(
      { "comments.userId": uid },
      {
        $set: {
          "comments.$[elem].userName": name,
          "comments.$[elem].userImage": picture,
        },
      },
      { arrayFilters: [{ "elem.userId": uid }] }
    );

    await db.collection("titles").updateMany(
      { "reviews.userId": uid },
      {
        $set: {
          "reviews.$[elem].userName": name,
          "reviews.$[elem].userImage": picture,
        },
      },
      { arrayFilters: [{ "elem.userId": uid }] }
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
    const db = client.db("nexus");

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
        { $pull: { comments: { userId: uid } } }
      );
    await db
      .collection("titles")
      .updateMany(
        { "reviews.userId": uid },
        { $pull: { reviews: { userId: uid } } }
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
        }
      );
    }

    res.status(200).json({ message: "user and its data deleted succesfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
