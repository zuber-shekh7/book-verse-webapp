import "server-only";
import { connectDB } from "./db";
import Author from "@/models/Author";
import Book from "@/models/Book";
import Genre from "@/models/Genre";
import User from "@/models/User";

// One grouped query per model. Documents without isActive count as drafts, like the public filters do.
async function activeSplit(Model) {
  const rows = await Model.aggregate([{ $group: { _id: "$isActive", n: { $sum: 1 } } }]);
  const active = rows.find((r) => r._id === true)?.n ?? 0;
  const total = rows.reduce((sum, r) => sum + r.n, 0);
  return { active, draft: total - active };
}

export async function getDashboardStats() {
  await connectDB(); // before reading the clock (Cache Components)
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const [books, authors, genres, readers, newReaders, deactivated] = await Promise.all([
    activeSplit(Book),
    activeSplit(Author),
    activeSplit(Genre),
    User.countDocuments({ role: "reader" }),
    User.countDocuments({ role: "reader", createdAt: { $gte: weekAgo } }),
    User.countDocuments({ role: "reader", isActive: false }),
  ]);
  return { books, authors, genres, readers, newReaders, deactivated };
}
