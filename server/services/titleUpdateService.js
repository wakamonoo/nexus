import clientPromise from "../lib/mongodb.js";

export async function titleRefresh() {
  const client = await clientPromise;
  const mongodb = process.env.MONGODB;
  const db = client.db(mongodb);

  const now = new Date().toISOString().split("T")[0];

  const result = await db.collection("titles").updateMany(
    {
      status: "upcoming",
      $or: [
        {
          mediaType: "movie",
          release_date: { $ne: "", $lte: now },
        },
        {
          mediaType: "tv",
          first_air_date: { $ne: "", $lte: now },
        },
      ],
    },
    {
      $set: { status: "released" },
    },
  );

  console.log(`[CRON] updated ${result.modifiedCount} titles`);

  return result;
}
