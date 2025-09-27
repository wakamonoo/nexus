import express from "express";
import clientPromise from "../lib/mongodb.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

router.post("/addPost", async (req, res) => {
  try {
    const { text, userName, userImage } = req.body;
    const client = await clientPromise;
    const db = client.db("nexus");

    const newId = `post-${uuidv4()}`;
    await db.collection("posts").updateOne(
      { postId: newId },
      {
        $setOnInsert: {
          text,
          userName,
          userImage,
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

export default router;
