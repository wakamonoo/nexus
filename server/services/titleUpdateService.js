import clientPromise from "../lib/mongodb.js";

export async function titleRefresh() {
  const client = await clientPromise;
  const mongodb = process.env.MONGODB;
  const db = client.db(mongodb);

  await db.collection("titles").updateMany(
    {
      status: "upcoming",
      date: { $lte: new Date() },
    },
    {
      $set: { status: "released" },
    },
  );
}
