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

    let filter = {};

    if (query) {
      filter = { title: { $regex: query, $options: "i" } };
    }

    const titles = await db.collection("titles").find(filter).toArray();

    const mergedTitles = await Promise.all(
      titles.map(async (title) => {
        try {
          const endpoint = title.mediaType === "tv" ? "tv" : "movie";

          const response = await fetch(
            `https://api.themoviedb.org/3/${endpoint}/${title.tmdbId}?language=en-US&append_to_response=credits`,
            {
              headers: {
                Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
                accept: "application/json",
              },
            },
          );

          if (!response.ok) {
            throw new Error(`TMDB request failed ${response.status}`);
          }

          const tmdb = await response.json();

          const director =
            title.mediaType === "movie"
              ? tmdb.credits?.crew?.find((person) => person.job === "Director")
                  ?.name
              : tmdb.created_by?.map((person) => person.name).join(", ");

          const mergedTitle = {
            ...title,

            title: tmdb.title || title.title,
            poster: tmdb.poster_path || title.poster,
            backdrop: tmdb.backdrop_path,
            date: tmdb.release_date || title.date,
            duration: tmdb.runtime || title.duration,
            genres: tmdb.genres,
            director: director || title.director,
            timeline: title.timeline,
            phase: title.phase,
            type: title.type,
            order: title.order,
            category: title.category,
            universe: title.universe,
            status: title.status,
            connections: title.connections,
          };

          return mergedTitle;
        } catch (err) {
          console.error(`Failed TMDB fetch for ${title.tmdbId}`, err.message);
          return title;
        }
      }),
    );

    res.status(200).json({ result: mergedTitles });
  } catch (err) {
    res.status(500).json({ error: "failed to fetch titles" });
  }
});

export default router;
