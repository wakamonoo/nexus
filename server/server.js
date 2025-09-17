import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import userRoute from "./routes/userRoute.js";
import userGet from "./routes/userGet.js"
import titleRoute from "./routes/titleRoute.js";
import titleGet from "./routes/titleGet.js"
import imageRoute from "./routes/imageRoute.js";
import countRoute from "./routes/countRoute.js"

const app = express();

dotenv.config();

const allowedOrigin = ["http://localhost:3000"];

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


const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`server running on http://localhost:${PORT}`)
);
