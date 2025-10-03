import express from "express";
import clientPromise from "../lib/mongodb.js";

const router = express.Router();

router.post("/saveRanking", async (req, res) => {
  try {
    const { userId, rankings } = req.body;
    const client = await clientPromise;
    const db = client.db("nexus");

    await db.collection("users").updateOne(
      {
        uid: userId,
      },
      { $set: { rankings } },
      { upsert: true }
    );

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
