import express from "express";

const app = express();

dotenv.config();

app.use(express.json);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}`);
});
