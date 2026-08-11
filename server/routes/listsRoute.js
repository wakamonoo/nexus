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

router.delete("/deleteList/:listId", async (req, res) => {
  try {
    const { listId } = req.params;
    const client = await clientPromise;
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

    await db.collection("lists").deleteOne({ listId });

    res.status(200).json({ message: "list delete success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

router.patch("/updateList/:listId", async (req, res) => {
  const { listId } = req.params;
  const { listTitle, listDescription, titles } = req.body;
  try {
    const client = await clientPromise;
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

    await db.collection("lists").updateOne(
      { listId },
      {
        $set: {
          listTitle,
          listDescription,
          titles,
          updatedAt: new Date(),
        },
      },
    );
    res.status(200).json({ message: "list update success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

export default router;
