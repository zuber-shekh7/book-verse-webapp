"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireReader } from "@/lib/dal";
import { connectDB } from "@/lib/db";
import { READING_STATUSES } from "@/lib/reading-status";
import Book from "@/models/Book";
import ReadingEntry from "@/models/ReadingEntry";

const SetSchema = z.object({
  bookId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid book"),
  status: z.enum(READING_STATUSES.map((s) => s.value), "Invalid status"),
});

// The reader is always taken from the session; only bookId and status come from the client.
export async function setReadingStatus(bookId, status) {
  const { userId } = await requireReader();
  const parsed = SetSchema.safeParse({ bookId, status });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await connectDB();
  if (!(await Book.exists({ _id: parsed.data.bookId }))) return { error: "Book not found" };

  const filter = { userId, bookId: parsed.data.bookId };
  const update = { status: parsed.data.status };
  try {
    await ReadingEntry.findOneAndUpdate(filter, update, { upsert: true, runValidators: true });
  } catch (e) {
    if (e.code !== 11000) throw e;
    // Two requests raced to create the same entry; the row exists now, so just update it.
    await ReadingEntry.findOneAndUpdate(filter, update);
  }
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function removeFromReadingList(bookId) {
  const { userId } = await requireReader();
  const parsed = SetSchema.shape.bookId.safeParse(bookId);
  if (!parsed.success) return { error: "Invalid book" };
  await connectDB();
  await ReadingEntry.deleteOne({ userId, bookId: parsed.data });
  revalidatePath("/", "layout");
  return { ok: true };
}
