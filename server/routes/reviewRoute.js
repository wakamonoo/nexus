import express from "express";
import clientPromise from "../lib/mongodb.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

router.post("/addReview", async (req, res) => {
  try {
    const { titleId, userId, userName, userImage, textReview } = req.body;

    const client = await clientPromise;
    const db = client.db("nexus");

    await db.collection("users").findOneAndUpdate(
      { uid: userId },
      [
        {
          $set: {
            totalReviews: { $add: [{ $ifNull: ["$totalReviews", 0] }, 1] },
          },
        },
        {
          $set: {
            taleCollector: {
              $cond: [{ $gte: ["$totalReviews", 15] }, true, false],
            },
            cinematicEye: {
              $cond: [{ $gte: ["$totalReviews", 30] }, true, false],
            },
            masterArchivist: {
              $cond: [{ $gte: ["$totalReviews", 60] }, true, false],
            },
          },
        },
      ],
      { upsert: true }
    );

    const newReview = {
      reviewId: `review-${uuidv4()}`,
      userId,
      userName,
      userImage,
      textReview,
      date: new Date(),
    };

    await db
      .collection("titles")
      .updateOne({ titleId }, { $push: { reviews: newReview } });

    res
      .status(200)
      .json({ message: "succes, review posted", review: newReview });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.delete("/deleteReview/:reviewId", async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { userId } = req.body;

    const client = await clientPromise;
    const db = client.db("nexus");

    await db.collection("users").updateOne({ uid: userId }, [
      {
        $set: {
          totalReviews: {
            $max: [{ $subtract: [{ $ifNull: ["$totalReviews", 0] }, 1] }, 0],
          },
        },
      },
    ]);

    await db
      .collection("titles")
      .updateOne(
        { "reviews.reviewId": reviewId },
        { $pull: { reviews: { reviewId } } }
      );

    res.status(200).json({ message: "Review deleted succesfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
