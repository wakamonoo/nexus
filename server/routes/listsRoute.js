import express from "express";
import clientPromise from "../lib/mongodb.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

router.post("/addlist", async (req, res) => {
  try {
    const { userId, listTitle, listDescription, titles } = req.body;

    const client = await clientPromise;
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

    await db.collection("lists").updateOne(
      { listId: `list-${uuidv4()}` },
      {
        $setOnInsert: {
          listTitle,
          listDescription,
          titles,
          userId,
          createdAt: new Date(),
        },
      },
      { upsert: true },
    );

    res.status(200).json({ message: "list created" });
  } catch (err) {
    console.error("list failed to create", err);
    res.status(401).json({ error: "failed to create list" });
  }
});

export default router;
