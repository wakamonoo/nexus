import express from "express";
import clientPromise from "../lib/mongodb.js";

const router = express.Router();

router.get("/countData", async (req, res) => {
  try {
    const client = await clientPromise;
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

    const usersCount = await db.collection("users").countDocuments();
    const titlesCount = await db.collection("titles").countDocuments();
    const releasedCount = await db
      .collection("titles")
      .countDocuments({ status: "released" });
    const upcomingCount = await db
      .collection("titles")
      .countDocuments({ status: "upcoming" });

    res
      .status(200)
      .json({ usersCount, titlesCount, releasedCount, upcomingCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "error fetching count" });
  }
});

export default router;
