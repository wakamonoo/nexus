import express from "express";
import clientPromise from "../lib/mongodb.js";

const router = express.Router();

router.get("/userGet/:uid", async (req, res) => {
  const { uid } = req.params;
  try {
    const client = await clientPromise;
    const db = client.db("sacredTimeline");

    const result = await db.collection("users").findOne({ uid });

    res.status(200).json({ result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to fetch user" });
  }
});

export default router;
