import express from "express";
import clientPromise from "../lib/mongodb.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

router.post("/addTitle", async (req, res) => {
  const {
    tmdbId,
    mediaType,
    timeline,
    phase,
    type,
    order,
    category,
    universe,
    status,
    connections,
  } = req.body;
  try {
    const client = await clientPromise;
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

    const newId = `title-${uuidv4()}`;
    await db.collection("titles").updateOne(
      { titleId: newId },
      {
        $setOnInsert: {
          tmdbId,
          mediaType,
          timeline,
          phase,
          type,
          order: Number(order) || null,
          category,
          universe,
          status,
          connections,
          reviews: [],
        },
      },
      { upsert: true },
    );
    res.status(200).json({ message: "success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

router.put("/updateTitle/:titleId", async (req, res) => {
  const { titleId } = req.params;
  const {
    tmdbId,
    mediaType,
    timeline,
    phase,
    type,
    order,
    category,
    universe,
    status,
    connections,
  } = req.body;
  try {
    const client = await clientPromise;
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

    await db.collection("titles").updateOne(
      { titleId },
      {
        $set: {
          tmdbId,
          mediaType,
          timeline,
          phase,
          type,
          order: Number(order) || null,
          category,
          universe,
          status,
          connections,
        },
      },
    );
    res.status(200).json({ message: "update success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

router.delete("/deleteTitle/:titleId", async (req, res) => {
  try {
    const { titleId } = req.params;
    const client = await clientPromise;
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

    await db.collection("titles").deleteOne({ titleId });

    res.status(200).json({ message: "title delete success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

export default router;
