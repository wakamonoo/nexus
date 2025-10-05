import express from "express";
import clientPromise from "../lib/mongodb.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

router.post("/addPost", async (req, res) => {
  try {
    const { text, userId, userName, userImage, files = [] } = req.body;
    const client = await clientPromise;
    const db = client.db("nexus");

    const newId = `post-${uuidv4()}`;
    await db.collection("posts").updateOne(
      { postId: newId },
      {
        $setOnInsert: {
          text,
          userId,
          userName,
          userImage,
          files,
          comments: [],
          date: new Date().toLocaleString(),
        },
      },
      { upsert: true }
    );
    res.status(200).json({ message: "success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

router.delete("/deletePost/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const client = await clientPromise;
    const db = client.db("nexus");

    await db.collection("posts").deleteOne({ postId });

    res.status(200).json({ message: "post delete success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

export default router;
