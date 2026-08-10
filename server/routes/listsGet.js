import express from "express";
import clientPromise from "../lib/mongodb.js";

const router = express.Router();

router.get("/listsGet", async (req, res) => {
  try {
    const client = await clientPromise;
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

    const result = await db
      .collection("lists")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json({ result });
  } catch (err) {
    res.status(500).json({ error: "failed to fetch lists" });
  }
});

export default router;
