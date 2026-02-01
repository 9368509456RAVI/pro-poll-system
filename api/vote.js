import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await client.connect();
    const db = client.db("pollDB");

    // Check if poll is closed
    const settings = await db.collection("settings").findOne({ name: "poll" });
    if (settings?.closed) {
      return res.status(403).json({ message: "Voting closed ⛔" });
    }

    // One vote per IP
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress;

    const existing = await db.collection("votes").findOne({ ip });
    if (existing) {
      return res.status(403).json({ message: "You already voted 🚫" });
    }

    // Save vote
    await db.collection("votes").insertOne({
      option: req.body.option,
      ip,
      createdAt: new Date(),
    });

    res.status(200).json({ message: "Vote recorded 🚀" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
