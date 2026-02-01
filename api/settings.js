import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req, res) {
  await client.connect();
  const db = client.db("pollDB");

  let settings = await db.collection("settings").findOne({ name: "poll" });

  // Agar first time hai to default settings bana do
  if (!settings) {
    settings = {
      name: "poll",
      pollOpen: true,
      pollId: Date.now().toString()
    };
    await db.collection("settings").insertOne(settings);
  }

  res.status(200).json({
    pollOpen: settings.pollOpen,
    pollId: settings.pollId
  });
}
