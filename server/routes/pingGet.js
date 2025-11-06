import express from "express";
import clientPromise from "../lib/mongodb.js";

const router = express.Router();

router.get("/pingGet/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const client = await clientPromise;
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

    const result = await db.collection("pings").find({ userId }).toArray();

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to fetch pings" });
  }
});

export default router;
