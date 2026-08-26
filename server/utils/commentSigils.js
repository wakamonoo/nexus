import { v4 as uuidv4 } from "uuid";

async function checkCommentSigils(db, io, userId, userBefore) {
  const updatedUser = await db.collection("users").findOne({ uid: userId });

  const earnedSigils = [];

  if (updatedUser.totalComments === 1 && !userBefore.friendlyNeighbor) {
    earnedSigils.push("Friendly Neighbor");
  }
  if (updatedUser.totalComments === 20 && !userBefore.alleySwinger) {
    earnedSigils.push("Alley Swinger");
  }
  if (updatedUser.totalComments === 40 && !userBefore.webWalker) {
    earnedSigils.push("Web Walker");
  }

  if (earnedSigils.length > 0) {
    for (const sigil of earnedSigils) {
      let sigilImage = "../../src/assets/fallback.png";
      if (sigil === "Friendly Neighbor")
        sigilImage = "/sigils/friendlyNeighbor.png";
      if (sigil === "Alley Swinger") sigilImage = "/sigils/alleySwinger.png";
      if (sigil === "Web Walker") sigilImage = "/sigils/webWalker.png";

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
}

export default checkCommentSigils;
