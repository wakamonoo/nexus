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

const allowedOrigin = [
  "http://localhost:3000",
  "https://nexus-wakamonoo.vercel.app",
];

const io = new SocketServer(server, {
  cors: {
    origin: allowedOrigin,
    credentials: true,
  },
});

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/users", userRoute);
app.use("/api/users", userGet);
app.use("/api/titles", titleRoute);
app.use("/api/titles", titleGet);
app.use("/api/uploads", imageRoute);
app.use("/api/counts", countRoute);
app.use("/api/messages", messageGet);

io.on("connection", (socket) => {
  console.log("a user is connected");

  socket.on("citadel", async (data) => {
    try {
      const { picture, sender, text, time, date } = data;
      const msg = {
        picture,
        sender,
        text,
        time,
        date,
        msgId: `msg-${uuid()}`,
      };

      const client = await clientPromise;
      const db = client.db("nexus");
      await db.collection("messages").insertOne(msg);
      io.emit("citadel", msg);
    } catch (err) {
      console.error(err);
    }
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () =>
  console.log(`server running on http://localhost:${PORT}`)
);
