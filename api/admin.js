import { MongoClient } from "mongodb";
const client = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req,res){
  await client.connect();
  const db = client.db("pollDB");

  const total = await db.collection("votes").countDocuments();
  const closed = await db.collection("settings").findOne({ name:"poll" });

  res.json({ totalVotes: total, closed: closed?.closed || false });
}
