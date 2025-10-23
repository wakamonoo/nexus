import express from "express";
import clientPromise from "../lib/mongodb.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

router.post("/addComment", async (req, res) => {
  try {
    const { postId, userId, userName, userImage, textComment } = req.body;

    const client = await clientPromise;
    const db = client.db("nexus");

    await db.collection("users").findOneAndUpdate(
      { uid: userId },
      [
        {
          $set: {
            totalComments: { $add: [{ $ifNull: ["$totalComments", 0] }, 1] },
          },
        },
        {
          $set: {
            friendlyNeighbor: {
              $cond: [{ $gte: ["$totalComments", 1] }, true, false],
            },
            alleySwinger: {
              $cond: [{ $gte: ["$totalComments", 10] }, true, false],
            },
            webWalker: {
              $cond: [{ $gte: ["$totalComments", 20] }, true, false],
            },
          },
        },
      ],
      { upsert: true }
    );

    const newComment = {
      commentId: `comment-${uuidv4()}`,
      userId,
      userName,
      userImage,
      textComment,
      date: new Date().toLocaleString(),
    };

    await db
      .collection("posts")
      .updateOne({ postId }, { $push: { comments: newComment } });

    res.status(200).json({ message: "succes, comment posted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.delete("/deleteComment/:commentId", async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId } = req.body;

    const client = await clientPromise;
    const db = client.db("nexus");

    await db
      .collection("users")
      .updateOne({ uid: userId }, { $inc: { totalComments: -1 } });

    await db
      .collection("posts")
      .updateOne(
        { "comments.commentId": commentId },
        { $pull: { comments: { commentId } } }
      );

    res.status(200).json({ message: "Comment deleted succesfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
