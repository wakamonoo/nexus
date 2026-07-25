import express from "express";
import clientPromise from "../lib/mongodb.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

const getTMDBDetails = async (tmdbId, mediaType, seasonNumber) => {
  if (!tmdbId || !mediaType) {
    throw new Error("TMDB ID and media type required");
  }

  if (mediaType !== "tv" || seasonNumber === null) {
    const endpoint = `${mediaType === "tv" ? "tv" : "movie"}/${tmdbId}`;

    const response = await fetch(
      `https://api.themoviedb.org/3/${endpoint}?language=en-US&append_to_response=credits,videos`,
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

    const details = await response.json();

    let releaseDates = null;

    if (mediaType === "movie") {
      const releaseDatesResponse = await fetch(
        `https://api.themoviedb.org/3/movie/${tmdbId}/release_dates`,
        {
          headers: {
            Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
            accept: "application/json",
          },
        },
      );
      if (releaseDatesResponse.ok) {
        releaseDates = await releaseDatesResponse.json();
      }
    }

    return {
      details,
      releaseDates,
      season: null,
    };
  }

  const [seriesResponse, seasonResponse] = await Promise.all([
    fetch(
      `https://api.themoviedb.org/3/tv/${tmdbId}?language=en-US&append_to_response=credits,videos`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
          accept: "application/json",
        },
      },
    ),

    fetch(
      `https://api.themoviedb.org/3/tv/${tmdbId}/season/${seasonNumber}?language=en-US&append_to_response=credits,videos`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
          accept: "application/json",
        },
      },
    ),
  ]);

  if (!seriesResponse.ok || !seasonResponse.ok) {
    throw new Error("TMDB request failed");
  }

  return {
    details: await seriesResponse.json(),
    season: await seasonResponse.json(),
    releaseDates: null,
  };
};

const buildTMDBData = (tmdbData, mediaType, seasonNumber, parentSeriesId) => {
  const { details, season, releaseDates } = tmdbData;

  const isSeason = mediaType === "tv" && seasonNumber !== null;

  const tmdb = details;
  const seasonData = isSeason ? season : null;

  const cast = tmdb.credits?.cast?.slice(0, 30).map((person) => ({
    tmdbId: person.id,
    name: person.name,
    character: person.character || "",
    profilePath: person.profile_path || null,
  }));

  const directors = tmdb.credits?.crew
    ?.filter((person) => person.job === "Director")
    .map((person) => ({
      tmdbId: person.id,
      name: person.name,
      profilePath: person.profile_path,
    }));

  const creators = tmdb.created_by?.map((person) => ({
    tmdbId: person.id,
    name: person.name,
    profilePath: person.profile_path || null,
  }));

  const trailer = (
    seasonData?.videos?.results?.length
      ? seasonData.videos.results
      : tmdb.videos?.results || []
  ).find(
    (video) =>
      video.site === "YouTube" &&
      video.type === "Trailer" &&
      video.official === true,
  );

  const firstEpisodeDate = seasonData?.episodes
    ?.map((episode) => episode.air_date)
    .filter(Boolean)
    .sort()
    .at(0);

  const lastEpisodeDate = seasonData?.episodes
    ?.map((episode) => episode.air_date)
    .filter(Boolean)
    .sort()
    .at(-1);

  const usTheatricalReleaseDate = releaseDates?.results
    ?.find((country) => country.iso_3166_1 === "US")
    ?.release_dates?.filter((release) => release.type === 3)
    ?.map((release) => release.release_date)
    ?.sort()
    ?.at(0);

  const latestTheatricalReleaseDate = releaseDates?.results
    ?.flatMap((country) =>
      country.release_dates
        ?.filter((release) => release.type === 3)
        ?.map((release) => release.release_date),
    )
    ?.filter(Boolean)
    ?.sort()
    ?.at(-1);

  const theatricalReleaseDate =
    usTheatricalReleaseDate || latestTheatricalReleaseDate || "";

  return {
    tmdbId: tmdb.id,
    mediaType,
    seasonNumber: seasonNumber ?? null,
    parentSeriesId: parentSeriesId ?? null,
    summary: seasonData?.overview || tmdb.overview || "",
    poster: seasonData?.poster_path || tmdb.poster_path || null,
    backdrop: tmdb.backdrop_path,
    trailer: trailer?.key || null,
    release_date: mediaType === "movie" ? theatricalReleaseDate : "",
    duration: tmdb.runtime || null,
    first_air_date: isSeason
      ? firstEpisodeDate || null
      : tmdb.first_air_date || null,
    last_air_date: isSeason
      ? lastEpisodeDate || null
      : tmdb.last_air_date || null,
    episode: seasonData?.episodes?.length || tmdb.number_of_episodes || null,
    genres: tmdb.genres || [],
    cast,
    directors,
    creators,
  };
};

router.post("/addTitle", async (req, res) => {
  const {
    title,
    tmdbId,
    mediaType,
    seasonNumber,
    parentSeriesId,
    timeline,
    phase,
    type,
    order,
    category,
    universe,
    status,
    connections,
  } = req.body;
  try {
    const client = await clientPromise;
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

    const tmdb = await getTMDBDetails(tmdbId, mediaType, seasonNumber);

    const tmdbData = buildTMDBData(
      tmdb,
      mediaType,
      seasonNumber,
      parentSeriesId,
    );

    const newId = `title-${uuidv4()}`;
    await db.collection("titles").updateOne(
      { titleId: newId },
      {
        $setOnInsert: {
          title,
          ...tmdbData,
          timeline,
          phase,
          type,
          order: Number(order) || null,
          category,
          universe,
          status,
          connections,
          reviews: [],
        },
      },
      { upsert: true },
    );
    res.status(200).json({ message: "success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

router.put("/updateTitle/:titleId", async (req, res) => {
  const { titleId } = req.params;
  const {
    title,
    tmdbId,
    mediaType,
    seasonNumber,
    parentSeriesId,
    timeline,
    phase,
    type,
    order,
    category,
    universe,
    status,
    connections,
  } = req.body;
  try {
    const client = await clientPromise;
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

    const tmdb = await getTMDBDetails(tmdbId, mediaType, seasonNumber);

    const tmdbData = buildTMDBData(
      tmdb,
      mediaType,
      seasonNumber,
      parentSeriesId,
    );

    await db.collection("titles").updateOne(
      { titleId },
      {
        $set: {
          title,
          ...tmdbData,
          timeline,
          phase,
          type,
          order: Number(order) || null,
          category,
          universe,
          status,
          connections,
        },
      },
    );
    res.status(200).json({ message: "update success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

router.delete("/deleteTitle/:titleId", async (req, res) => {
  try {
    const { titleId } = req.params;
    const client = await clientPromise;
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

    await db.collection("titles").deleteOne({ titleId });

    res.status(200).json({ message: "title delete success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

export default router;
