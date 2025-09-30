import express from "express";
import clientPromise from "../lib/mongodb.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

router.post("/addTitle", async (req, res) => {
  const {
    title,
    image,
    date,
    timeline,
    phase,
    type,
    director,
    order,
    episode,
    duration,
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
          date,
          timeline,
          phase,
          type,
          director,
          order,
          episode,
          duration,
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

export default router;
