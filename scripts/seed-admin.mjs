// Usage: npm run seed:admin   (reads MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD from .env.local)
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
if (!MONGODB_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("Set MONGODB_URI, ADMIN_EMAIL and ADMIN_PASSWORD in .env.local");
  process.exit(1);
}

await mongoose.connect(MONGODB_URI);
const users = mongoose.connection.collection("users");
const email = ADMIN_EMAIL.toLowerCase().trim();

if (await users.findOne({ email })) {
  console.log(`Admin ${email} already exists. Nothing to do.`);
} else {
  const now = new Date();
  await users.insertOne({
    email,
    passwordHash: await bcrypt.hash(ADMIN_PASSWORD, 12),
    role: "admin",
    createdAt: now,
    updatedAt: now,
  });
  console.log(`Created admin ${email}`);
}
await mongoose.disconnect();
