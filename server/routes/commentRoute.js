import express from "express";
import clientPromise from "../lib/mongodb.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

router.post("/addComment", async (req, res) => {
  try {
    const { postId, userId, userName, userImage, textComment } = req.body;

    const client = await clientPromise;
    const db = client.db("nexus");

    const post = await db.collection("posts").findOne({ postId });

    await db.collection("users").findOneAndUpdate(
      { uid: userId },
      [
        {
          $set: {
            totalComments: { $add: [{ $ifNull: ["$totalComments", 0] }, 1] },
          },
        },
        {
          $set: {
            friendlyNeighbor: {
              $cond: [{ $gte: ["$totalComments", 1] }, true, false],
            },
            alleySwinger: {
              $cond: [{ $gte: ["$totalComments", 20] }, true, false],
            },
            webWalker: {
              $cond: [{ $gte: ["$totalComments", 40] }, true, false],
            },
          },
        },
      ],
      { upsert: true }
    );

    const newComment = {
      commentId: `comment-${uuidv4()}`,
      userId,
      userName,
      userImage,
      textComment,
      date: new Date(),
    };

    await db
      .collection("posts")
      .updateOne({ postId }, { $push: { comments: newComment } });

    const io = req.app.get("io");
    const postOwner = post.userId;

    if (postOwner && postOwner !== userId) {
      const pingData = {
        pingId: `ping-${uuidv4()}`,
        type: "comment",
        senderId: userId,
        senderName: userName,
        senderImage: userImage,
        userId: postOwner,
        postId,
        message: "commented on you post.",
        date: new Date(),
        isRead: false,
      };

      await db.collection("pings").insertOne(pingData);

      io.to(postOwner).emit("ping", pingData);
      console.log(`ping sent to ${postOwner}`);
    }

    res
      .status(200)
      .json({ message: "succes, comment posted", comment: newComment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/addReply", async (req, res) => {
  try {
    const { postId, commentId, userId, userName, userImage, textReply } =
      req.body;

    const client = await clientPromise;
    const db = client.db("nexus");

    await db.collection("users").findOneAndUpdate(
      { uid: userId },
      [
        {
          $set: {
            totalComments: { $add: [{ $ifNull: ["$totalComments", 0] }, 1] },
          },
        },
        {
          $set: {
            friendlyNeighbor: {
              $cond: [{ $gte: ["$totalComments", 1] }, true, false],
            },
            alleySwinger: {
              $cond: [{ $gte: ["$totalComments", 20] }, true, false],
            },
            webWalker: {
              $cond: [{ $gte: ["$totalComments", 40] }, true, false],
            },
          },
        },
      ],
      { upsert: true }
    );

    const newReply = {
      replyId: `reply-${uuidv4()}`,
      commentId,
      userId,
      userName,
      userImage,
      textReply,
      date: new Date(),
    };

    await db
      .collection("posts")
      .updateOne(
        { postId },
        { $push: { "comments.$[comment].replies": newReply } },
        { arrayFilters: [{ "comment.commentId": commentId }] }
      );

    res.status(200).json({ message: "succes, reply posted", reply: newReply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.delete("/deleteComment/:commentId", async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId } = req.body;

    const client = await clientPromise;
    const db = client.db("nexus");

    await db.collection("users").updateOne({ uid: userId }, [
      {
        $set: {
          totalComments: {
            $max: [{ $subtract: [{ $ifNull: ["$totalComments", 0] }, 1] }, 0],
          },
        },
      },
    ]);

    const delCommentResult = await db
      .collection("posts")
      .updateOne(
        { "comments.commentId": commentId },
        { $pull: { comments: { commentId } } }
      );

    if (delCommentResult.modifiedCount === 0) {
      await db
        .collection("posts")
        .updateOne(
          { "comments.replies.replyId": commentId },
          { $pull: { "comments.$[].replies": { replyId: commentId } } }
        );
    }

    res.status(200).json({ message: "Comment deleted succesfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
