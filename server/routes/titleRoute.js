import express from "express";
import clientPromise from "../lib/mongodb.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router()

router.post("/addTitle", async (req, res) => {
  const { image, title, date, timeline, summary } = req.body;
  try {
    const client = await clientPromise;
    const db = client.db("sacredTimeline");

    const newId = `title-${uuidv4()}`
    await db.collection("titles").updateOne(
      { titleId: newId },
      { $setOnInsert: { image, title, date, timeline, summary }},
      { upsert: true }
    )
    res.status(200).json({ message: "success" })
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err })
  }
})

export default router;