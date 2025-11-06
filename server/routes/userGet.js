import express from "express";
import clientPromise from "../lib/mongodb.js";

const router = express.Router();

router.get("/userGet/:uid", async (req, res) => {
  const { uid } = req.params;
  try {
    const client = await clientPromise;
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

    const result = await db.collection("users").findOne({ uid });

    res.status(200).json({ result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to fetch user" });
  }
});

router.get("/allUsersGet", async (req, res) => {
  try {
    const client = await clientPromise;
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

    const { query } = req.query;

    let filter = {};

    if (query) {
      filter = { name: { $regex: query, $options: "i" } };
    }

    const result = await db.collection("users").find(filter).toArray();

    res.status(200).json({ result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to fetch user" });
  }
});

export default router;
