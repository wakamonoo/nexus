import express from "express";
import clientPromise from "../lib/mongodb.js";
import tmdb from "../services/tmdbService.js";

const router = express.Router();

router.get("/titleGet", async (req, res) => {
  try {
    const client = await clientPromise;
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

    const { query } = req.query;

    const filter = query ? { title: { $regex: query, $options: "i" } } : {};

    const result = await db
      .collection("titles")
      .aggregate([
        { $match: filter },
        {
          $project: {
            _id: 0,
            titleId: 1,
            title: 1,
            poster: 1,
            backdrop: 1,
            status: 1,
            category: 1,
            universe: 1,
            timeline: 1,
            phase: 1,
            type: 1,
            order: 1,
            release_date: 1,
            first_air_date: 1,
            last_air_date: 1,
            totalPoints: 1,
            watchCount: {
              $size: {
                $ifNull: ["$watchCount", []],
              },
            },
          },
        },
      ])
      .toArray();

    res.status(200).json({ result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to fetch titles" });
  }
});

router.get("/titleGet/:titleId", async (req, res) => {
  try {
    const { titleId } = req.params;

    const client = await clientPromise;
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

    const title = await db.collection("titles").findOne(
      { titleId },
      {
        projection: {
          _id: 0,
        },
      },
    );

    if (!title) {
      return res.status(404).json({
        error: "title not found",
      });
    }

    let rank = null;

    if (title.totalPoints > 0) {
      rank =
        (await db
          .collection("titles")
          .countDocuments({ totalPoints: { $gt: title.totalPoints } })) + 1;
    }

    res.json({ title, rank });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to fetch title" });
  }
});

export default router;
