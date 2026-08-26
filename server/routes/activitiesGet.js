import express from "express";
import clientPromise from "../lib/mongodb.js";

const router = express.Router();

router.get("/activitiesGet", async (req, res) => {
  try {
    const client = await clientPromise;
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

    const result = await db.collection("activities").find({}).sort({ date: -1}).toArray();

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to fetch activities" });
  }
});

export default router;
