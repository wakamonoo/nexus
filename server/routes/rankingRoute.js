import express from "express";
import clientPromise from "../lib/mongodb.js";

const router = express.Router();

router.post("/saveRanking", async (req, res) => {
  try {
    const { userId, rankings } = req.body;
    const client = await clientPromise;
    const db = client.db("nexus");

    await db.collection("users").updateOne(
      {
        uid: userId,
      },
      { $set: { rankings } },
      { upsert: true }
    );

    res.status(200).json({ message: "use ranking saved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "use ranking save failed" });
  }
});

export default router;
