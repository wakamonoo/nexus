import express from "express";
import clientPromise from "../lib/mongodb.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

router.post("/addMoment", async (req, res) => {
  try {
    const { userId, image, titleId, caption } = req.body;

    const client = await clientPromise;
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

    const newId = `moment-${uuidv4()}`;
    const newMoment = {
      momentId: newId,
      userId,
      image,
      titleId,
      caption,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };

    await db.collection("moments").updateOne(
      { momentId: newMoment.momentId },
      {
        $setOnInsert: newMoment,
      },
      { upsert: true },
    );
    res.status(200).json({ message: "success", moment: newMoment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

router.delete("/deleteMoment/:momentId", async (req, res) => {
  try {
    const { momentId } = req.params;
    const { userId } = req.body;

    const client = await clientPromise;
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

    await db.collection("moments").deleteOne({ momentId, userId });

    res.status(200).json({ message: "moment delete success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

export default router;
