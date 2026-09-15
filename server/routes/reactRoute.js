import express from "express";
import clientPromise from "../lib/mongodb.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

router.post("/postEnergize", async (req, res) => {
  try {
    const { postId, userId } = req.body;

    const io = req.app.get("io");
    const client = await clientPromise;
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

    const post = await db.collection("posts").findOne({ postId });

    let update;

    const hasEnergized = post.energized?.includes(userId);

    if (hasEnergized) {
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
        { upsert: true },
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

      const postOwner = post.userId;

      if (postOwner && postOwner !== userId) {
        const pingData = {
          pingId: `ping-${uuidv4()}`,
          type: "energize",
          senderId: userId,
          userId: postOwner,
          postId,
          message: "energized your post.",
          date: new Date(),
          isRead: false,
        };

        await db.collection("pings").insertOne(pingData);

        io.to(postOwner).emit("ping", pingData);
        console.log(`ping sent to ${postOwner}`);
      }

      update = { $addToSet: { energized: userId } };
    }

    await db.collection("posts").updateOne({ postId }, update);

    const updatedPost = await db.collection("posts").findOne({ postId });

    const energizeData = {
      postId,
      energized: updatedPost.energized || [],
    };

    io.emit("postEnergizedUpdated", energizeData);

    res.status(200).json({
      message: hasEnergized ? "energize removed" : "post energized",
      ...energizeData,
    });
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
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

    const post = await db.collection("posts").findOne({ postId });

    let update;

    const hasEchoed = post.echoed?.includes(userId);

    if (hasEchoed) {
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
        { upsert: true },
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

      const postOwner = post.userId;

      if (postOwner && postOwner !== userId) {
        const pingData = {
          pingId: `ping-${uuidv4()}`,
          type: "echo",
          senderId: userId,
          userId: postOwner,
          postId,
          message: "echoed your post.",
          date: new Date(),
          isRead: false,
        };

        await db.collection("pings").insertOne(pingData);

        io.to(postOwner).emit("ping", pingData);
        console.log(`ping sent to ${postOwner}`);
      }

      update = { $addToSet: { echoed: userId } };
    }

    await db.collection("posts").updateOne({ postId }, update);

    const updatedPost = await db.collection("posts").findOne({ postId });

    const echoData = {
      postId,
      echoed: updatedPost.echoed || [],
    };

    io.emit("postEchoedUpdated", echoData);

    res.status(200).json({
      message: hasEchoed ? "echo removed" : "post echoed",
      ...echoData,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

router.patch("/reviewVote/:reviewId", async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { userId, vote } = req.body;

    if (!userId || !["up", "down"].includes(vote)) {
      return res.status(400).json({
        error: "Invalid userId or vote",
      });
    }

    const io = req.app.get("io");
    const client = await clientPromise;
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

    const title = await db
      .collection("titles")
      .findOne(
        { "reviews.reviewId": reviewId },
        { projection: { titleId: 1, title: 1, reviews: 1 } },
      );

    if (!title) {
      return res.status(404).json({ error: "review not found" });
    }

    const review = title.reviews.find((review) => review.reviewId === reviewId);

    if (!review) {
      return res.status(404).json({ error: "review not found" });
    }

    const hasUpvoted = review.upvotes?.includes(userId);
    const hasDownvoted = review.downvotes?.includes(userId);

    let update;

    if (vote === "up") {
      if (hasUpvoted) {
        update = {
          $pull: {
            "reviews.$.upvotes": userId,
          },
        };
      } else {
        update = {
          $addToSet: { "reviews.$.upvotes": userId },
          $pull: { "reviews.$.downvotes": userId },
        };
      }
    } else {
      if (hasDownvoted) {
        update = {
          $pull: {
            "reviews.$.downvotes": userId,
          },
        };
      } else {
        update = {
          $addToSet: { "reviews.$.downvotes": userId },
          $pull: { "reviews.$.upvotes": userId },
        };
      }
    }

    await db
      .collection("titles")
      .updateOne({ "reviews.reviewId": reviewId }, update);

    const updatedTitle = await db
      .collection("titles")
      .findOne(
        { "reviews.reviewId": reviewId },
        { projection: { reviews: 1 } },
      );

    const updatedReview = updatedTitle.reviews.find(
      (review) => review.reviewId === reviewId,
    );

    const voteData = {
      reviewId,
      upvotes: updatedReview.upvotes || [],
      downvotes: updatedReview.downvotes || [],
    };

    io.emit("reviewVoteUpdated", voteData);

    const upvoteMileStones = [1, 5, 10, 25, 50, 100, 250, 500, 1000];

    const upvoteCount = voteData.upvotes.length;

    const isMilestone = upvoteMileStones.includes(upvoteCount);

    if (
      vote === "up" &&
      !hasUpvoted &&
      isMilestone &&
      updatedReview.userId &&
      updatedReview.userId !== userId
    ) {
      const pingData = {
        pingId: `ping-${uuidv4()}`,
        type: "reviewUpvote",
        senderId: "system",
        senderName: "Nexus",
        senderImage: "/icons/alt_logo.png",
        userId: updatedReview.userId,
        titleId: title.titleId,
        message:
          upvoteCount === 1
            ? `congrats, your review on ${title.title} received its first upvote`
            : `congrats, your review on ${title.title} reached ${upvoteCount} upvotes`,
        date: new Date(),
        isRead: false,
      };

      await db.collection("pings").insertOne(pingData);

      io.to(updatedReview.userId).emit("ping", pingData);
      console.log(`ping sent to ${updatedReview.userId}`);
    }

    res.status(200).json({
      message: `${vote} succeful`,
      ...voteData,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.patch("/listVote/:listId", async (req, res) => {
  try {
    const { listId } = req.params;
    const { userId, vote } = req.body;

    if (!userId || !["up", "down"].includes(vote)) {
      return res.status(400).json({
        error: "Invalid userId or vote",
      });
    }

    const io = req.app.get("io");
    const client = await clientPromise;
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

    const list = await db.collection("lists").findOne({ listId });

    if (!list) {
      return res.status(404).json({ error: "list not found" });
    }

    const hasUpvoted = list.upvotes?.includes(userId);
    const hasDownvoted = list.downvotes?.includes(userId);

    let update;

    if (vote === "up") {
      if (hasUpvoted) {
        update = {
          $pull: {
            upvotes: userId,
          },
        };
      } else {
        update = {
          $addToSet: { upvotes: userId },
          $pull: { downvotes: userId },
        };
      }
    } else {
      if (hasDownvoted) {
        update = {
          $pull: {
            downvotes: userId,
          },
        };
      } else {
        update = {
          $addToSet: { downvotes: userId },
          $pull: { upvotes: userId },
        };
      }
    }

    await db.collection("lists").updateOne({ listId }, update);

    const updatedList = await db
      .collection("lists")
      .findOne(
        { listId },
        { projection: { listId: 1, upvotes: 1, downvotes: 1 } },
      );

    const voteData = {
      listId,
      upvotes: updatedList.upvotes || [],
      downvotes: updatedList.downvotes || [],
    };

    io.emit("listVoteUpdated", voteData);

    const upvoteMileStones = [1, 5, 10, 25, 50, 100, 250, 500, 1000];

    const upvoteCount = voteData.upvotes.length;

    const isMilestone = upvoteMileStones.includes(upvoteCount);

    if (
      vote === "up" &&
      !hasUpvoted &&
      isMilestone &&
      list.userId &&
      list.userId !== userId
    ) {
      const pingData = {
        pingId: `ping-${uuidv4()}`,
        type: "listUpvote",
        senderId: "system",
        senderName: "Nexus",
        senderImage: "/icons/alt_logo.png",
        userId: list.userId,
        listId: list.listId,
        message:
          upvoteCount === 1
            ? `congrats, ${list.listTitle} received its first upvote`
            : `congrats, ${list.listTitle} reached ${upvoteCount} upvotes`,
        date: new Date(),
        isRead: false,
      };

      await db.collection("pings").insertOne(pingData);

      io.to(list.userId).emit("ping", pingData);
      console.log(`ping sent to ${list.userId}`);
    }

    res.status(200).json({
      message: `${vote} succeful`,
      ...voteData,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/momentLove", async (req, res) => {
  try {
    const { momentId, ownerId, userId, title } = req.body;

    const io = req.app.get("io");
    const client = await clientPromise;
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

    const moment = await db.collection("moments").findOne({ momentId });

    if (!moment) {
      return res.status(404).json({ error: "moment not found" });
    }

    let update;

    const hasLoved = moment.loved?.includes(userId);

    if (hasLoved) {
      update = {
        $pull: {
          loved: userId,
        },
      };
    } else {
      if (ownerId && ownerId !== userId) {
        const pingData = {
          pingId: `ping-${uuidv4()}`,
          type: "love",
          senderId: userId,
          userId: ownerId,
          momentId,
          message: `loved your moment watching ${title}`,
          date: new Date(),
          isRead: false,
        };

        await db.collection("pings").insertOne(pingData);

        io.to(ownerId).emit("ping", pingData);
        console.log(`ping sent to ${ownerId}`);
      }

      update = {
        $addToSet: {
          loved: userId,
        },
      };
    }

    await db.collection("moments").updateOne({ momentId }, update);

    const updatedMoment = await db.collection("moments").findOne({ momentId });

    const loveData = {
      momentId,
      loved: updatedMoment.loved || [],
    };

    io.emit("momentLoveUpdated", loveData);

    res.status(200).json({
      message: hasLoved ? "love removed" : "moment loved",
      ...loveData,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

export default router;
