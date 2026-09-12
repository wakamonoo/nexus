import express from "express";
import clientPromise from "../lib/mongodb.js";

const router = express.Router();

router.get("/momentGet", async (req, res) => {
  try {
    const client = await clientPromise;
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

    const result = await db
      .collection("moments")
      .find({
        expiresAt: { $gt: new Date() },
      })
      .sort({ _id: -1 })
      .toArray();

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to fetch posts" });
  }
});

export default router;
