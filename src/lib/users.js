import "server-only";
import { isValidObjectId } from "mongoose";
import { connectDB } from "./db";
import User from "@/models/User";

// Never select passwordHash: these results are passed to components.
const FIELDS = "name email role isActive createdAt updatedAt";

const plain = (doc) => JSON.parse(JSON.stringify(doc));

export async function listUsers() {
  await connectDB();
  return plain(await User.find().sort({ createdAt: -1 }).select(FIELDS).lean());
}

export async function getUser(id) {
  if (!isValidObjectId(id)) return null;
  await connectDB();
  const user = await User.findById(id).select(FIELDS).lean();
  return user ? plain(user) : null;
}
