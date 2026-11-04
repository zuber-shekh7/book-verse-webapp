import "server-only";
import mongoose, { isValidObjectId } from "mongoose";
import { publicBookFilter } from "./catalog";
import { connectDB } from "./db";
import { READING_STATUSES } from "./reading-status";
import Book from "@/models/Book";
import ReadingEntry from "@/models/ReadingEntry";

const plain = (doc) => JSON.parse(JSON.stringify(doc));

export async function getEntryStatus(userId, bookId) {
  if (!isValidObjectId(bookId)) return null;
  await connectDB();
  const entry = await ReadingEntry.findOne({ userId, bookId }).select("status").lean();
  return entry?.status ?? null;
}

// Ids of books readers can currently see; entries for hidden books are kept but not shown or counted.
const visibleBookIds = async () => Book.find(await publicBookFilter()).distinct("_id");

// Entries newest-activity first, each with its book (title, cover, authors). status is optional.
export async function listEntries(userId, status) {
  await connectDB();
  const entries = await ReadingEntry.find({ userId, bookId: { $in: await visibleBookIds() }, ...(status ? { status } : {}) })
    .sort({ updatedAt: -1 })
    .populate({
      path: "bookId",
      select: "title coverUrl authors",
      populate: { path: "authors", select: "name", match: { isActive: true } },
    })
    .lean();
  return plain(entries)
    .filter((e) => e.bookId) // book may have been deleted
    .map((e) => ({ status: e.status, book: e.bookId }));
}

// { all, wishlist, reading, ... } with zeros filled in.
export async function countByStatus(userId) {
  await connectDB();
  const rows = await ReadingEntry.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId), bookId: { $in: await visibleBookIds() } } },
    { $group: { _id: "$status", n: { $sum: 1 } } },
  ]);
  const counts = Object.fromEntries(READING_STATUSES.map((s) => [s.value, 0]));
  let all = 0;
  for (const r of rows) {
    if (r._id in counts) {
      counts[r._id] = r.n;
      all += r.n;
    }
  }
  return { all, ...counts };
}
