const settings = await db.collection("settings").findOne({ name: "poll" });

if(settings?.closed){
  return res.status(403).json({ message: "Voting closed ⛔" });
}
