import express from "express";
import clientPromise from "../lib/mongodb.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

router.post("/addComment", async (req, res) => {
  try {
    const { postId, userId, userName, userImage, textComment } = req.body;

    const client = await clientPromise;
    const db = client.db("nexus");

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

export default router;
