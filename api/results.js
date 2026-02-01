import { MongoClient } from "mongodb";
const client = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req, res) {
  await client.connect();
  const db = client.db("pollDB");

  const results = await db.collection("votes").aggregate([
    { $group: { _id: "$option", count: { $sum: 1 } } }
  ]).toArray();

  res.status(200).json(results);
}
