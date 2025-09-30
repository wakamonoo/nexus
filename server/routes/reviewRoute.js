import express from "express";
import clientPromise from "../lib/mongodb.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

router.post("/addReview", async (req, res) => {
  try {
    const { titleId, userId, userName, userImage, textReview } = req.body;

    const client = await clientPromise;
    const db = client.db("nexus");

    const newReview = {
      reviewId: `review-${uuidv4()}`,
      userId,
      userName,
      userImage,
      textReview,
      date: new Date().toLocaleString(),
    };

    await db
      .collection("titles")
      .updateOne({ titleId }, { $push: { reviews: newReview } });

    res.status(200).json({ message: "succes, review posted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
