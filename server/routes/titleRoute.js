import express from "express";
import clientPromise from "../lib/mongodb.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

router.post("/addTitle", async (req, res) => {
  const {
    title,
    image,
    posterCredit,
    posterCreditUrl,
    date,
    timeline,
    phase,
    type,
    director,
    order,
    episode,
    duration,
    trailer,
    summary,
  } = req.body;
  try {
    const client = await clientPromise;
    const db = client.db("nexus");

    const newId = `title-${uuidv4()}`;
    await db.collection("titles").updateOne(
      { titleId: newId },
      {
        $setOnInsert: {
          title,
          image,
          posterCredit,
          posterCreditUrl,
          date,
          timeline,
          phase,
          type,
          director,
          order: Number(order) || null,
          episode: Number(episode) || null,
          duration: Number(duration) || null,
          trailer,
          summary,
          reviews: [],
        },
      },
      { upsert: true }
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
    title,
    image,
    posterCredit,
    posterCreditUrl,
    date,
    timeline,
    phase,
    type,
    director,
    order,
    episode,
    duration,
    trailer,
    summary,
  } = req.body;
  try {
    const client = await clientPromise;
    const db = client.db("nexus");

    await db.collection("titles").updateOne(
      { titleId },
      {
        $set: {
          title,
          image,
          posterCredit,
          posterCreditUrl,
          date,
          timeline,
          phase,
          type,
          director,
          order: Number(order) || null,
          episode: Number(episode) || null,
          duration: Number(duration) || null,
          trailer,
          summary,
        },
      }
    );
    res.status(200).json({ message: "update success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

export default router;
