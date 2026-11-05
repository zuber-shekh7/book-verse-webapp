import "server-only";
import { connectDB } from "./db";
import BookRequest, { REQUEST_STATUS_VALUES } from "@/models/BookRequest";

const plain = (doc) => JSON.parse(JSON.stringify(doc));

// Case-insensitive title order puts repeat requests for the same book next to each other.
const BY_TITLE = { locale: "en", strength: 2 };

export async function listRequests(status) {
  await connectDB();
  const filter = REQUEST_STATUS_VALUES.includes(status) ? { status } : {};
  const rows = await BookRequest.find(filter)
    .collation(BY_TITLE)
    .sort({ title: 1, createdAt: 1 })
    .populate("userId", "name email")
    .lean();
  return plain(rows);
}

export async function listRequestsForUser(userId) {
  await connectDB();
  return plain(await BookRequest.find({ userId }).sort({ createdAt: -1 }).lean());
}
