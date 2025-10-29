import express from "express";
import clientPromise from "../lib/mongodb.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

router.post("/postEnergize", async (req, res) => {
  try {
    const { postId, userId } = req.body;

    const io = req.app.get("io");
    const client = await clientPromise;
    const db = client.db("nexus");

    const post = await db.collection("posts").findOne({ postId });

    let update;
    if (post.energized?.includes(userId)) {
      await db.collection("users").updateOne({ uid: userId }, [
        {
          $set: {
            totalEnergized: {
              $max: [
                { $subtract: [{ $ifNull: ["$totalEnergized", 0] }, 1] },
                0,
              ],
            },
          },
        },
      ]);

      update = { $pull: { energized: userId } };
    } else {
      const userBefore = await db.collection("users").findOne({ uid: userId });

      await db.collection("users").findOneAndUpdate(
        { uid: userId },
        [
          {
            $set: {
              totalEnergized: {
                $add: [{ $ifNull: ["$totalEnergized", 0] }, 1],
              },
            },
          },
          {
            $set: {
              vanguard: {
                $cond: [{ $gte: ["$totalEnergized", 20] }, true, false],
              },
              paragon: {
                $cond: [{ $gte: ["$totalEnergized", 40] }, true, false],
              },
            },
          },
        ],
        { upsert: true }
      );

      const updatedUser = await db.collection("users").findOne({ uid: userId });

      const earnedSigils = [];

      if (updatedUser.totalEnergized === 20 && !userBefore.vanguard) {
        earnedSigils.push("Vanguard");
      }
      if (updatedUser.totalEnergized === 40 && !userBefore.paragon) {
        earnedSigils.push("Paragon");
      }

      if (earnedSigils.length > 0) {
        for (const sigil of earnedSigils) {
          let sigilImage = "../../src/assets/fallback.png";
          if (sigil === "Vanguard") sigilImage = "/sigils/vanguard.png";
          if (sigil === "Paragon") sigilImage = "/sigils/paragon.png";

          const pingData = {
            pingId: `ping-${uuidv4()}`,
            type: "sigil",
            senderId: "system",
            senderName: "Nexus",
            senderImage: sigilImage,
            userId,
            message: `just awarded you the ${sigil} sigil, congrats!`,
            date: new Date(),
            isRead: false,
          };

          await db.collection("pings").insertOne(pingData);

          io.to(userId).emit("ping", pingData);
          console.log(`ping sent to ${userId}`);
        }
      }

      update = { $addToSet: { energized: userId } };
    }

    await db.collection("posts").updateOne({ postId }, update);

    const updatedPost = await db.collection("posts").findOne({ postId });
    res.status(200).json({ energized: updatedPost.energized });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

router.post("/postEcho", async (req, res) => {
  try {
    const { postId, userId } = req.body;

    const io = req.app.get("io");
    const client = await clientPromise;
    const db = client.db("nexus");

    const post = await db.collection("posts").findOne({ postId });

    let update;
    if (post.echoed?.includes(userId)) {
      await db.collection("users").updateOne({ uid: userId }, [
        {
          $set: {
            totalEchoed: {
              $max: [{ $subtract: [{ $ifNull: ["$totalEchoed", 0] }, 1] }, 0],
            },
          },
        },
      ]);

      update = { $pull: { echoed: userId } };
    } else {
      const userBefore = await db.collection("users").findOne({ uid: userId });

      await db.collection("users").findOneAndUpdate(
        { uid: userId },
        [
          {
            $set: {
              totalEchoed: {
                $add: [{ $ifNull: ["$totalEchoed", 0] }, 1],
              },
            },
          },
          {
            $set: {
              insightScout: {
                $cond: [{ $gte: ["$totalEchoed", 15] }, true, false],
              },
              loreGuardian: {
                $cond: [{ $gte: ["$totalEchoed", 30] }, true, false],
              },
            },
          },
        ],
        { upsert: true }
      );

      const updatedUser = await db.collection("users").findOne({ uid: userId });

      const earnedSigils = [];

      if (updatedUser.totalEchoed === 15 && !userBefore.insightScout) {
        earnedSigils.push("Insight Scout");
      }
      if (updatedUser.totalEchoed === 30 && !userBefore.loreGuardian) {
        earnedSigils.push("Lore Guardian");
      }

      if (earnedSigils.length > 0) {
        for (const sigil of earnedSigils) {
          let sigilImage = "../../src/assets/fallback.png";
          if (sigil === "Insight Scout")
            sigilImage = "/sigils/insightScout.png";
          if (sigil === "Lore Guardian")
            sigilImage = "/sigils/loreGuardian.png";

          const pingData = {
            pingId: `ping-${uuidv4()}`,
            type: "sigil",
            senderId: "system",
            senderName: "Nexus",
            senderImage: sigilImage,
            userId,
            message: `just awarded you the ${sigil} sigil, congrats!`,
            date: new Date(),
            isRead: false,
          };

          await db.collection("pings").insertOne(pingData);

          io.to(userId).emit("ping", pingData);
          console.log(`ping sent to ${userId}`);
        }
      }

      update = { $addToSet: { echoed: userId } };
    }

    await db.collection("posts").updateOne({ postId }, update);

    const updatedPost = await db.collection("posts").findOne({ postId });
    res.status(200).json({ echoed: updatedPost.echoed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

export default router;
