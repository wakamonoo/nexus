import express from "express";
import clientPromise from "../lib/mongodb.js";

const router = express.Router();

router.get("/countData", async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db("nexus");

    const usersCount = await db.collection("users").countDocuments();
    const titlesCount = await db.collection("titles").countDocuments();

    res.status(200).json({ usersCount, titlesCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "error fetching count" });
  }
});

export default router;
