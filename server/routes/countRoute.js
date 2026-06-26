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
    const releasedTitlesCount = await db
      .collection("titles")
      .countDocuments({ status: "released" });
    const upcomingTitlesCount = await db
      .collection("titles")
      .countDocuments({ status: "upcoming" });
    const mcuTitlesCount = await db
      .collection("titles")
      .countDocuments({ category: "mcu" });
    const legacyTitlesCount = await db
      .collection("titles")
      .countDocuments({ category: "legacy" });

    res
      .status(200)
      .json({
        usersCount,
        titlesCount,
        releasedTitlesCount,
        upcomingTitlesCount,
        mcuTitlesCount,
        legacyTitlesCount,
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "error fetching count" });
  }
});

export default router;
