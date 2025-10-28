import express from "express";
import clientPromise from "../lib/mongodb.js";

const router = express.Router();

router.get("/latestReviewsGet", async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db("nexus");

    const titles = await db.collection("titles").find({}).toArray();

    const allReviews = titles
      ?.flatMap(
        (title) =>
          title.reviews?.map((review) => ({
            ...review,
            title: title.title,
            titleId: title.titleId,
          })) || []
      )
      .filter(Boolean);

    const sorted = allReviews.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    res.status(200).json(sorted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
