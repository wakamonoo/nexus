import express from "express";
import clientPromise from "../lib/mongodb.js";
import { v4 as uuidv4 } from "uuid";
const router = express.Router();

router.post("/addFeedback", async (req, res) => {
  try {
    const { userId, rating, review } = req.body;

    const client = await clientPromise;
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

    const newFeedback = {
      feedbackId: `feedback-${uuidv4()}`,
      userId,
      rating,
      review,
      createdAt: new Date(),
    };

    await db.collection("feedbacks").updateOne(
      { feedbackId: newFeedback.feedbackId },
      {
        $setOnInsert: newFeedback,
      },

      { upsert: true },
    );

    res
      .status(200)
      .json({ message: "succes, feedback posted", feedback: newFeedback });
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "failed to submit feedback" });
  }
});

export default router;
