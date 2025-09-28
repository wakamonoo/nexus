import express from "express";
import clientPromise from "../lib/mongodb.js";

const router = express.Router();

router.get("/commentGet/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const client = await clientPromise;
    const db = client.db("nexus");

    const post = await db.collection("posts").findOne({ postId });

    res.status(200).json(post.comments || []);
  } catch (err) {}
});

export default router;
