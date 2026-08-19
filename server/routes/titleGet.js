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
            mediaType: 1,
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

    res.status(200).json({ title, rank });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to fetch title" });
  }
});

router.get("/personGet/:personId", async (req, res) => {
  try {
    const { personId } = req.params;

    const client = await clientPromise;
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

    const result = await db
      .collection("titles")
      .aggregate([
        {
          $match: {
            $or: [
              {
                cast: {
                  $elemMatch: {
                    tmdbId: Number(personId),
                  },
                },
              },
              {
                crew: {
                  $elemMatch: {
                    tmdbId: Number(personId),
                  },
                },
              },
            ],
          },
        },

        {
          $project: {
            _id: 0,
            titleId: 1,
            title: 1,
            poster: 1,
            category: 1,
            status: 1,
            reviews: 1,
            castPerson: {
              $arrayElemAt: [
                {
                  $filter: {
                    input: { $ifNull: ["$cast", []] },
                    as: "person",
                    cond: {
                      $eq: ["$$person.tmdbId", Number(personId)],
                    },
                  },
                },
                0,
              ],
            },
            crewPerson: {
              $arrayElemAt: [
                {
                  $filter: {
                    input: { $ifNull: ["$crew", []] },
                    as: "person",
                    cond: {
                      $eq: ["$$person.tmdbId", Number(personId)],
                    },
                  },
                },
                0,
              ],
            },
          },
        },
      ])
      .toArray();

    const personEntry =
      result.find((title) => title.castPerson)?.castPerson ||
      result.find((title) => title.crewPerson)?.crewPerson ||
      null;

    const projects = result.map((title) => ({
      titleId: title.titleId,
      title: title.title,
      poster: title.poster,
      category: title.category,
      status: title.status,
      reviews: title.reviews || [],
    }));

    res.status(200).json({
      person: personEntry
        ? {
            tmdbId: personEntry.tmdbId,
            name: personEntry.name,
            profilePath: personEntry.profilePath,
            biography: personEntry.biography,
          }
        : null,
      projects,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to fetch person projects" });
  }
});

export default router;
