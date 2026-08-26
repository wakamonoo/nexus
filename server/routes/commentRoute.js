import express from "express";
import clientPromise from "../lib/mongodb.js";
import { v4 as uuidv4 } from "uuid";
import checkCommentSigils from "../utils/commentSigils.js";

const router = express.Router();

router.post("/addComment", async (req, res) => {
  try {
    const { postId, userId, textComment, files = [] } = req.body;

    const io = req.app.get("io");
    const client = await clientPromise;
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

    const post = await db.collection("posts").findOne({ postId });

    const userBefore = await db.collection("users").findOne({ uid: userId });

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
      { upsert: true },
    );

    await checkCommentSigils(db, io, userId, userBefore);

    const newComment = {
      commentId: `comment-${uuidv4()}`,
      userId,
      textComment,
      files,
      date: new Date(),
    };

    await db
      .collection("posts")
      .updateOne({ postId }, { $push: { comments: newComment } });

    const postOwner = post.userId;

    if (postOwner && postOwner !== userId) {
      const pingData = {
        pingId: `ping-${uuidv4()}`,
        type: "postComment",
        senderId: userId,
        userId: postOwner,
        postId,
        message: "commented on your post.",
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
    const {
      postId,
      postOwnerUserId,
      commentId,
      commentUserId,
      userId,
      textReply,
      files = [],
    } = req.body;

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
      { upsert: true },
    );

    await checkCommentSigils(db, io, userId, userBefore);

    const newReply = {
      replyId: `reply-${uuidv4()}`,
      commentId,
      userId,
      textReply,
      files,
      date: new Date(),
    };

    await db
      .collection("posts")
      .updateOne(
        { postId },
        { $push: { "comments.$[comment].replies": newReply } },
        { arrayFilters: [{ "comment.commentId": commentId }] },
      );

    const commentOwner = commentUserId;
    const post = await db.collection("posts").findOne({ postId });
    const postOwner = await db
      .collection("users")
      .findOne({ uid: post.userId });

    if (commentOwner && commentOwner !== userId) {
      const pingData = {
        pingId: `ping-${uuidv4()}`,
        type: "reply",
        senderId: userId,
        userId: commentOwner,
        postId,
        message: `replied to your comment on ${
          postOwnerUserId === commentOwner
            ? "your"
            : postOwnerUserId === userId
              ? "their"
              : `${postOwner.name}'s`
        } post`,
        date: new Date(),
        isRead: false,
      };

      await db.collection("pings").insertOne(pingData);

      io.to(commentOwner).emit("ping", pingData);
      console.log(`ping sent to ${commentOwner}`);
    }

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
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

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
        { $pull: { comments: { commentId } } },
      );

    if (delCommentResult.modifiedCount === 0) {
      await db
        .collection("posts")
        .updateOne(
          { "comments.replies.replyId": commentId },
          { $pull: { "comments.$[].replies": { replyId: commentId } } },
        );
    }

    res.status(200).json({ message: "Comment deleted succesfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
