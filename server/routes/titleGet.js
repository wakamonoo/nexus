import express from "express";
import clientPromise from "../lib/mongodb.js";

const router = express.Router();

router.get("/titleGet", async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB);

    const titles = await db.collection("titles").find({}).toArray();

    const mergedTitles = await Promise.all(
      titles.map(async (title) => {
        if (!title.tmdbId || !title.mediaType) return title;

        try {
          const endpoint =
            title.mediaType === "tv" ? "tv" : "movie";

          const response = await fetch(
            `https://api.themoviedb.org/3/${endpoint}/${title.tmdbId}?language=en-US`,
            {
              headers: {
                Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
                accept: "application/json",
              },
            }
          );

          const tmdb = await response.json();

          return {
            ...title,

            title: tmdb.title || tmdb.name,
            originalTitle:
              tmdb.original_title || tmdb.original_name,

            overview: tmdb.overview,

            poster_path: tmdb.poster_path,
            backdrop_path: tmdb.backdrop_path,

            release_date:
              tmdb.release_date ||
              tmdb.first_air_date,

            runtime: tmdb.runtime,

            genres: tmdb.genres,

            vote_average: tmdb.vote_average,

            vote_count: tmdb.vote_count,

            popularity: tmdb.popularity,

            tagline: tmdb.tagline,

            homepage: tmdb.homepage,

            imdb_id: tmdb.imdb_id,
          };
        } catch (err) {
          console.error(
            `Failed TMDB fetch for ${title.tmdbId}`
          );

          return title;
        }
      })
    );

    res.status(200).json({
      result: mergedTitles,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "failed to fetch titles",
    });
  }
});

export default router;