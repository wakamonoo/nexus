import express from "express";
import clientPromise from "../lib/mongodb.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

router.post("/addReview", async (req, res) => {
  try {
    const { titleId, title, poster, userId, userName, userImage, textReview } =
      req.body;

    const io = req.app.get("io");
    const client = await clientPromise;
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

    const userBefore = await db.collection("users").findOne({ uid: userId });
    const titlesCount = await db.collection("titles").countDocuments();

    await db.collection("users").findOneAndUpdate(
      { uid: userId },
      [
        {
          $set: {
            totalReviews: { $add: [{ $ifNull: ["$totalReviews", 0] }, 1] },
          },
        },
        {
          $set: {
            taleCollector: {
              $cond: [{ $gte: ["$totalReviews", 15] }, true, false],
            },
            cinematicEye: {
              $cond: [{ $gte: ["$totalReviews", 30] }, true, false],
            },
            masterArchivist: {
              $cond: [{ $gte: ["$totalReviews", 60] }, true, false],
            },
          },
        },
      ],
      { upsert: true }
    );

    const updatedUser = await db.collection("users").findOne({ uid: userId });

    const earnedSigils = [];

    if (updatedUser.totalReviews === 15 && !userBefore.taleCollector) {
      earnedSigils.push("Tale Collector");
    }
    if (updatedUser.totalReviews === 30 && !userBefore.cinematicEye) {
      earnedSigils.push("Cinematic Eye");
    }
    if (updatedUser.totalReviews === 60 && !userBefore.masterArchivist) {
      earnedSigils.push("Master Archivist");
    }

    if (earnedSigils.length > 0) {
      for (const sigil of earnedSigils) {
        let sigilImage = "../../src/assets/fallback.png";
        if (sigil === "Tale Collector")
          sigilImage = "/sigils/taleCollector.png";
        if (sigil === "Cinematic Eye") sigilImage = "/sigils/cinematicEye.png";
        if (sigil === "Master Archivist")
          sigilImage = "/sigils/masterArchivist.png";

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

    const newReview = {
      reviewId: `review-${uuidv4()}`,
      userId,
      userName,
      userImage,
      textReview,
      date: new Date(),
    };

    await db
      .collection("titles")
      .updateOne({ titleId }, { $push: { reviews: newReview } });

    const data = {
      titleId,
      title,
      userId,
      userName,
      userImage,
      textReview,
      date: new Date(),
    };

    io.emit("newReview", data);

    const existingWatch = await db
      .collection("watchList")
      .findOne({ userId, titleId });

    if (!existingWatch || !existingWatch.watched) {
      await db.collection("watchList").updateOne(
        {
          userId,
          titleId,
        },
        {
          $setOnInsert: {
            userName,
            title,
            poster,
            createdAt: new Date(),
          },
          $set: {
            watched: true,
          },
        },
        { upsert: true }
      );

      await db.collection("users").findOneAndUpdate(
        { uid: userId },
        [
          {
            $set: {
              totalWatched: { $add: [{ $ifNull: ["$totalWatched", 0] }, 1] },
            },
          },
          {
            $set: {
              vigilante: {
                $cond: [{ $gte: ["$totalWatched", 20] }, true, false],
              },
              ascendant: {
                $cond: [{ $gte: ["$totalWatched", 40] }, true, false],
              },
              cosmic: {
                $cond: [{ $gte: ["$totalWatched", titlesCount] }, true, false],
              },
            },
          },
        ],
        { upsert: true }
      );

      const updatedUser = await db.collection("users").findOne({ uid: userId });

      const earnedSigils = [];

      if (updatedUser.totalWatched === 20 && !userBefore.vigilante) {
        earnedSigils.push("Vigilante");
      }
      if (updatedUser.totalWatched === 40 && !userBefore.ascendant) {
        earnedSigils.push("Ascendant");
      }
      if (updatedUser.totalWatched === titlesCount && !userBefore.cosmic) {
        earnedSigils.push("Cosmic");
      }

      if (earnedSigils.length > 0) {
        for (const sigil of earnedSigils) {
          let sigilImage = "../../src/assets/fallback.png";
          if (sigil === "Vigilante") sigilImage = "/sigils/vigilante.png";
          if (sigil === "Ascendant") sigilImage = "/sigils/ascendant.png";
          if (sigil === "Cosmic") sigilImage = "/sigils/cosmic.png";

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

      await db.collection("titles").updateOne(
        {
          titleId,
        },
        { $addToSet: { watchCount: userId } },
        { upsert: true }
      );
    }

    res
      .status(200)
      .json({ message: "succes, review posted", review: newReview });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.delete("/deleteReview/:reviewId", async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { userId } = req.body;

    const client = await clientPromise;
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

    await db.collection("users").updateOne({ uid: userId }, [
      {
        $set: {
          totalReviews: {
            $max: [{ $subtract: [{ $ifNull: ["$totalReviews", 0] }, 1] }, 0],
          },
        },
      },
    ]);

    await db
      .collection("titles")
      .updateOne(
        { "reviews.reviewId": reviewId },
        { $pull: { reviews: { reviewId } } }
      );

    res.status(200).json({ message: "Review deleted succesfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
