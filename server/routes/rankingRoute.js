import express from "express";
import clientPromise from "../lib/mongodb.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

router.post("/saveRanking", async (req, res) => {
  try {
    const { userId, rankings } = req.body;

    const io = req.app.get("io");
    const client = await clientPromise;
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

    const existingUser = await db.collection("users").findOne(
      { uid: userId },
      {
        projection: {
          rankings: 1,
        },
      },
    );

    const previousGoat = existingUser?.rankings?.find(
      (ranking) => ranking.points === 15,
    );

    await db.collection("users").updateOne(
      {
        uid: userId,
      },
      { $set: { rankings } },
      { upsert: true },
    );

    const newGoat = rankings?.find((ranking) => ranking.points === 15);

    if (newGoat && newGoat.titleId !== previousGoat?.titleId) {
      const goat = await db.collection("titles").findOne(
        {
          titleId: newGoat.titleId,
        },
        {
          projection: {
            title: 1,
          },
        },
      );

      const activityData = {
        activityId: `activity-${uuidv4()}`,
        userId,
        message: `ranked ${goat?.title} as their goat.`,
        date: new Date(),
      };

      await db.collection("activities").insertOne(activityData);

      io.emit("activity", activityData);
    }

    const allUsers = await db.collection("users").find({}).toArray();

    const totalsMap = {};

    allUsers.forEach((user) => {
      user.rankings?.forEach((r) => {
        if (!totalsMap[r.titleId]) {
          totalsMap[r.titleId] = { votes: 0, totalPoints: 0 };
        }

        totalsMap[r.titleId].votes += 1;
        totalsMap[r.titleId].totalPoints += r.points;
      });
    });

    const bulkOps = Object.entries(totalsMap).map(([titleId, data]) => ({
      updateOne: {
        filter: { titleId },
        update: {
          $set: {
            votes: data.votes,
            totalPoints: data.totalPoints,
          },
        },
      },
    }));

    const allTitleIds = await db
      .collection("titles")
      .find({}, { projection: { titleId: 1 } })
      .toArray();

    const resetOps = allTitleIds
      .filter((t) => !totalsMap[t.titleId])
      .map((t) => ({
        updateOne: {
          filter: { titleId: t.titleId },
          update: {
            $set: {
              votes: 0,
              totalPoints: 0,
            },
          },
        },
      }));

    const finalOps = [...bulkOps, ...resetOps];

    if (finalOps.length > 0) {
      await db.collection("titles").bulkWrite(finalOps);
    }

    res.status(200).json({ message: "use ranking saved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "use ranking save failed" });
  }
});

export default router;
