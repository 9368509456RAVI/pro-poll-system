import { MongoClient } from "mongodb";
const client = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req,res){
  await client.connect();
  const db = client.db("pollDB");
  const votes = await db.collection("votes").find().toArray();

  let text = votes.map(v =>
    `Option: ${v.option} | Time: ${v.createdAt}`
  ).join("\n");

  res.setHeader("Content-Type","text/plain");
  res.setHeader("Content-Disposition","attachment; filename=votes.txt");
  res.send(text);
}
