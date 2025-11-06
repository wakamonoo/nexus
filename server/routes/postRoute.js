import express from "express";
import clientPromise from "../lib/mongodb.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

router.post("/addPost", async (req, res) => {
  try {
    const { topic, text, userId, userName, userImage, files = [] } = req.body;

    const io = req.app.get("io");
    const client = await clientPromise;
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

    const userBefore = await db.collection("users").findOne({ uid: userId });

    await db.collection("users").findOneAndUpdate(
      { uid: userId },
      [
        {
          $set: {
            totalPosts: { $add: [{ $ifNull: ["$totalPosts", 0] }, 1] },
          },
        },
        {
          $set: {
            primeProspect: {
              $cond: [{ $gte: ["$totalPosts", 1] }, true, false],
            },
            emergingLuminary: {
              $cond: [{ $gte: ["$totalPosts", 10] }, true, false],
            },
            heroicScribe: {
              $cond: [{ $gte: ["$totalPosts", 20] }, true, false],
            },
          },
        },
      ],
      { upsert: true }
    );

    const updatedUser = await db.collection("users").findOne({ uid: userId });

    const earnedSigils = [];

    if (updatedUser.totalPosts === 1 && !userBefore.primeProspect) {
      earnedSigils.push("Prime Prospect");
    }
    if (updatedUser.totalPosts === 10 && !userBefore.emergingLuminary) {
      earnedSigils.push("Emerging Luminary");
    }
    if (updatedUser.totalPosts === 20 && !userBefore.heroicScribe) {
      earnedSigils.push("Heroic Scribe");
    }

    if (earnedSigils.length > 0) {
      for (const sigil of earnedSigils) {
        let sigilImage = "../../src/assets/fallback.png";
        if (sigil === "Prime Prospect")
          sigilImage = "/sigils/primeProspect.png";
        if (sigil === "Emerging Luminary")
          sigilImage = "/sigils/emergingLuminary.png";
        if (sigil === "Heroic Scribe") sigilImage = "/sigils/heroicScribe.png";

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

    const newId = `post-${uuidv4()}`;
    await db.collection("posts").updateOne(
      { postId: newId },
      {
        $setOnInsert: {
          topic,
          text,
          userId,
          userName,
          userImage,
          files,
          comments: [],
          date: new Date(),
        },
      },
      { upsert: true }
    );
    res.status(200).json({ message: "success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

router.delete("/deletePost/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;
    const client = await clientPromise;
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

    await db.collection("users").updateOne({ uid: userId }, [
      {
        $set: {
          totalPosts: {
            $max: [{ $subtract: [{ $ifNull: ["$totalPosts", 0] }, 1] }, 0],
          },
        },
      },
    ]);

    await db.collection("posts").deleteOne({ postId });

    res.status(200).json({ message: "post delete success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

export default router;
