import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server as SocketServer } from "socket.io";
import clientPromise from "./lib/mongodb.js";
import { v4 as uuid } from "uuid";

import userRoute from "./routes/userRoute.js";
import userGet from "./routes/userGet.js";
import titleRoute from "./routes/titleRoute.js";
import titleGet from "./routes/titleGet.js";
import imageRoute from "./routes/imageRoute.js";
import countRoute from "./routes/countRoute.js";
import messageGet from "./routes/messagesGet.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:3000",
  "https://nexus-wakamonoo.vercel.app", // frontend (Vercel)
];

const io = new SocketServer(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());

// REST API routes
app.use("/api/users", userRoute);
app.use("/api/users", userGet);
app.use("/api/titles", titleRoute);
app.use("/api/titles", titleGet);
app.use("/api/uploads", imageRoute);
app.use("/api/counts", countRoute);
app.use("/api/messages", messageGet);

async function messageCollection() {
  const client = await clientPromise;
  const db = client.db("nexus");
  return db.collection("messages");
}

// Global chat room name
const GLOBAL_ROOM = "global_chat";

io.on("connection", (socket) => {
  console.log(`socket ${socket.id} connected`);

  // auto join global chat
  socket.join(GLOBAL_ROOM);

  // Keep-alive ping
  socket.on("ping", () => {
    socket.emit("pong");
  });

  // Send a new message
  socket.on("citadel", async (data) => {
    try {
      const { picture, sender, email, text, time, date } = data;
      const msg = {
        picture,
        sender,
        email,
        text,
        time,
        date,
        msgId: `msg-${uuid()}`,
      };

      const col = await messageCollection();
      await col.insertOne(msg);

      // emit only to the global room
      io.to(GLOBAL_ROOM).emit("citadel", msg);
    } catch (err) {
      console.error("send message error", err);
    }
  });

  socket.on("disconnect", () => {
    console.log(`socket ${socket.id} disconnected`);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () =>
  console.log(`server running on http://localhost:${PORT}`)
);
