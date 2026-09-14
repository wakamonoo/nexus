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
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to fetch posts" });
  }
});

router.get("/momentGet/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const client = await clientPromise;
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

    const result = await db
      .collection("moments")
      .find({
        userId,
      })
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to fetch moment" });
  }
});

export default router;
