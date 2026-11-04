// Usage: npm run backfill:active   (reads MONGODB_URI from .env.local)
// Marks catalog documents created before the isActive flag existed as active, so the live catalog stays visible.
import mongoose from "mongoose";

const { MONGODB_URI } = process.env;
if (!MONGODB_URI) {
  console.error("Set MONGODB_URI in .env.local");
  process.exit(1);
}

await mongoose.connect(MONGODB_URI);
for (const name of ["books", "authors", "genres"]) {
  const res = await mongoose.connection
    .collection(name)
    .updateMany({ isActive: { $exists: false } }, { $set: { isActive: true } });
  console.log(`${name}: ${res.modifiedCount} marked active`);
}
await mongoose.disconnect();
