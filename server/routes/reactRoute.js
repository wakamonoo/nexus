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
      update = { $pull: { energized: userId } };
    } else {
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
      update = { $pull: { echoed: userId } };
    } else {
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
