import express from "express";
import tmdb from "../services/tmdbService.js";

const router = express.Router();

router.get("/search", async (req, res) => {
  try {
    const query = req.query.q?.trim();

    if (!query) {
      return res.json();
    }

    const seasonMatch = query.match(/^(.*?)\s+season\s+(\d+)$/i);

    if (seasonMatch) {
      const seriesQuery = seasonMatch[1].trim();
      const seasonNumber = Number(seasonMatch[2]);

      const searchData = await tmdb.search(seriesQuery);

      const tvResults = searchData.results.filter(
        (item) => item.media_type === "tv",
      );

      if (tvResults.length === 0) {
        return res.json([]);
      }

      const seasonResults = await Promise.all(
        tvResults.map(async (series) => {
          try {
            const tvDetails = await tmdb.tvDetails(series.id);

            const season = tvDetails.seasons?.find(
              (item) => item.season_number === seasonNumber,
            );

            if (!season) {
              return null;
            }

            return {
              type: "season",
              id: tvDetails.id,
              media_type: "tv",
              seasonId: season.id,
              seasonNumber: season.season_number,
              seasonName: season.name,
              parentSeriesId: tvDetails.id,
              title: tvDetails.name,
              poster_path: season.poster_path || tvDetails.poster_path,
              first_air_date: season.air_date || tvDetails.first_air_date,
            };
          } catch (err) {
            console.error(
              `Failed to fetch TV Series ${series.id}:`,
              err.message,
            );
            return null;
          }
        }),
      );

      const validSeasonResults = seasonResults.filter(Boolean);

      return res.json(validSeasonResults);
    }
    const data = await tmdb.search(query);

    const results = data.results.filter(
      (item) => item.media_type === "movie" || item.media_type === "tv",
    );

    return res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
