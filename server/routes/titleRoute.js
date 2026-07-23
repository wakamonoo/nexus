import express from "express";
import clientPromise from "../lib/mongodb.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

const getTMDBDetails = async (tmdbId, mediaType) => {
  if (!tmdbId || !mediaType) {
    throw new Error("TMDB ID and media type required");
  }

  const endpoint = mediaType === "tv" ? "tv" : "movie";

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

  return response.json();
};

const buildTMDBData = (tmdb, mediaType) => {
  const cast = tmdb.credits?.cast?.slice(0, 30).map((person) => ({
    tmdbId: person.Id,
    name: person.name,
    character: person.character || "",
    profilePath: person.profile_path || null,
  }));

  const directors = tmdb.credits?.crew
    ?.filter((person) => person.job === "Director")
    .map({
      tmdbId: person.id,
      name: person.name,
      profilePath: person.profile_path,
    });

  const creators = tmdb.createc_by?.map((person) => ({
    tmdbId: person.id,
    name: person.name,
    profilePath: person.profile_path,
  }));

  return {
    tmdbId: tmdb.id,
    mediaType,
    summary: tmdb.overview || "",
    poster: tmdb.poster_path || null,
    backdrop: tmdb.backdrop_path,
    release_date: tmdb.release_date || "",
    duration: tmdb.runtime || null,
    first_air_date: tmdb.first_air_date || null,
    last_air_date: tmdb.last_air_date || null,
    genres: tmdb
  }
};












router.post("/addTitle", async (req, res) => {
  const {
    tmdbId,
    mediaType,
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

    const newId = `title-${uuidv4()}`;
    await db.collection("titles").updateOne(
      { titleId: newId },
      {
        $setOnInsert: {
          tmdbId,
          mediaType,
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
    tmdbId,
    mediaType,
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

    await db.collection("titles").updateOne(
      { titleId },
      {
        $set: {
          tmdbId,
          mediaType,
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
