import express from "express";
import clientPromise from "../lib/mongodb.js";

const router = express.Router();

router.get("/postGet", async (req, res) => {
  try {
    const client = await clientPromise;
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

    const result = await db
      .collection("posts")
      .find({})
      .sort({ _id: -1 })
      .toArray();

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to fetch posts" });
  }
});

router.get("/postGet/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const client = await clientPromise;
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

    const result = await db.collection("posts").findOne({ postId });

    if (!result) {
      return res.status(404).json({
        error: "post not found",
      });
    }

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to fetch post" });
  }
});

export default router;
