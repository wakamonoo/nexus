import express from "express";
import clientPromise from "../lib/mongodb.js";

const router = express.Router();

router.post("/postEnergize", async (req, res) => {
  try {
    const { postId, userId } = req.body;
    const client = await clientPromise;
    const db = client.db("nexus");

    const post = await db.collection("posts").findOne({ postId });

    let update;
    if (post.energized?.includes(userId)) {
      await db
        .collection("users")
        .updateOne({ uid: userId }, { $inc: { totalEnergized: -1 } });

      update = { $pull: { energized: userId } };
    } else {
      await db.collection("users").findOneAndUpdate(
        { uid: userId },
        [
          {
            $set: {
              totalEnergized: {
                $add: [{ $ifNull: ["$totalEnergized", 0] }, 1],
              },
            },
          },
          {
            $set: {
              vanguard: {
                $cond: [{ $gte: ["$totalEnergized", 20] }, true, false],
              },
              paragon: {
                $cond: [{ $gte: ["$totalEnergized", 40] }, true, false],
              },
            },
          },
        ],
        { upsert: true }
      );

      update = { $addToSet: { energized: userId } };
    }

    await db.collection("posts").updateOne({ postId }, update);

    const updatedPost = await db.collection("posts").findOne({ postId });
    res.status(200).json({ energized: updatedPost.energized });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

router.post("/postEcho", async (req, res) => {
  try {
    const { postId, userId } = req.body;
    const client = await clientPromise;
    const db = client.db("nexus");

    const post = await db.collection("posts").findOne({ postId });

    let update;
    if (post.echoed?.includes(userId)) {
      await db
        .collection("users")
        .updateOne({ uid: userId }, { $inc: { totalEchoed: -1 } });

      update = { $pull: { echoed: userId } };
    } else {
      await db.collection("users").findOneAndUpdate(
        { uid: userId },
        [
          {
            $set: {
              totalEchoed: {
                $add: [{ $ifNull: ["$totalEchoed", 0] }, 1],
              },
            },
          },
          {
            $set: {
              insightScout: {
                $cond: [{ $gte: ["$totalEchoed", 10] }, true, false],
              },
              loreGuardian: {
                $cond: [{ $gte: ["$totalEchoed", 20] }, true, false],
              },
            },
          },
        ],
        { upsert: true }
      );

      update = { $addToSet: { echoed: userId } };
    }

    await db.collection("posts").updateOne({ postId }, update);

    const updatedPost = await db.collection("posts").findOne({ postId });
    res.status(200).json({ echoed: updatedPost.echoed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

export default router;
