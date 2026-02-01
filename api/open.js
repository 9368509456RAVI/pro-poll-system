import { MongoClient } from "mongodb";
const client = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req, res) {
  await client.connect();
  const db = client.db("pollDB");

  const newPollId = Date.now(); // new poll session

  await db.collection("settings").updateOne(
    { name: "poll" },
    { $set: { closed: false, pollId: newPollId } },
    { upsert: true }
  );

  res.status(200).json({ message: "Poll reopened", pollId: newPollId });
}
