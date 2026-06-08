import express from "express";
import clientPromise from "../lib/mongodb.js";

const router = express.Router();

router.get("/newsGet", async (req, res) => {
  try {
    const client = await clientPromise;
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

    const news = await db
      .collection("news")
      .findOne({}, { sort: { createdAt: -1 } });

    res.status(200).json(news);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
