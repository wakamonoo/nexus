import express from "express";
import clientPromise from "../lib/mongodb.js";

const router = express.Router();

router.get("/isWatchedGet", async (req, res) => {
  try {
    const { userId, titleId } = req.query;
    const client = await clientPromise;
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

    const result = await db
      .collection("watchList")
      .findOne({ userId, titleId });

    res.status(200).json({ result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

router.get("/watchedInfoGet", async (req, res) => {
  try {
    const { userId } = req.query;
    const client = await clientPromise;
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

    const result = await db.collection("watchList").find({ userId }).toArray();

    res.status(200).json({ result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

export default router;