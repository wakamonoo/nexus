import express from "express";
import clientPromise from "../lib/mongodb.js";

const router = express.Router();

router.get("/latestReviewsGet", async (req, res) => {
  try {
    const client = await clientPromise;
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

    const result = await db
      .collection("titles")
      .aggregate([
        {
          $unwind: "$reviews",
        },
        {
          $project: {
            _id: 0,
            reviewId: "$reviews.reviewId",
            userId: "$reviews.userId",
            textReview: "$reviews.textReview",
            date: "$reviews.date",
            upvotes: "$reviews.upvotes",
            downvotes: "$reviews.downvotes",
            titleId: 1,
            title: 1,
          },
        },
        {
          $sort: {
            date: -1,
          },
        },
      ])
      .toArray();

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
