import express from "express";
import clientPromise from "../lib/mongodb.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

const getTMDBDetails = async (tmdbId, mediaType, seasonNumber) => {
  if (!tmdbId || !mediaType) {
    throw new Error("TMDB ID and media type required");
  }

  let endpoint;

  if (mediaType == "tv" && seasonNumber !== null) {
    endpoint = `tv/${tmdbId}/season/${seasonNumber}`;
  } else {
    endpoint = `${mediaType === "tv" ? "tv" : "movie"}/${tmdbId}`;
  }

  const response = await fetch(
    `https://api.themoviedb.org/3/${endpoint}?language=en-US&append_to_response=credits, videos`,
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

  return response.json();
};

const buildTMDBData = (tmdb, mediaType, seasonNumber, parentSeriesId) => {
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

  const trailer = tmdb.videos?.results?.find(
    (video) =>
      video.site === "YouTube" &&
      video.type === "Trailer" &&
      video.official == true,
  );
  return {
    tmdbId: tmdb.id,
    mediaType,
    seasonNumber: seasonNumber ?? null,
    parentSeriesId: parentSeriesId ?? null,
    summary: tmdb.overview || "",
    poster: tmdb.poster_path || null,
    backdrop: tmdb.backdrop_path,
    trailer: trailer?.key || null,
    release_date: tmdb.release_date || "",
    duration: tmdb.runtime || null,
    first_air_date: tmdb.first_air_date || null,
    last_air_date: tmdb.last_air_date || null,
    episode: tmdb.number_of_episodes || null,
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
