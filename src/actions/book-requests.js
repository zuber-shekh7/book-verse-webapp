"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin, requireReader } from "@/lib/dal";
import { connectDB } from "@/lib/db";
import { searchAuthors, searchBooks, searchGenres } from "@/lib/catalog";
import BookRequest from "@/models/BookRequest";

const MAX_PENDING = 10;

// ---- Search-first suggestions (public catalog data, active records only) ----

export async function searchCatalogTitles(q) {
  const books = await searchBooks({ q: String(q ?? "") });
  return books.slice(0, 5).map((b) => ({
    key: b._id,
    label: b.title,
    sub: `by ${b.authors.map((a) => a.name).join(", ")}`,
    href: `/books/${b._id}`,
  }));
}

const toItems = (rows) => rows.map((r) => ({ key: r._id, label: r.name }));

export async function searchCatalogAuthors(q) {
  return toItems(await searchAuthors(String(q ?? "")));
}

export async function searchCatalogGenres(q) {
  return toItems(await searchGenres(String(q ?? "")));
}

// ---- Reader ----

const RequestSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200, "Title is too long"),
  author: z.string().trim().min(1, "Author is required").max(120, "Author name is too long"),
  genre: z.string().trim().min(1, "Genre is required").max(80, "Genre is too long"),
});

export async function submitBookRequest(_prev, formData) {
  const { userId } = await requireReader();
  const parsed = RequestSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await connectDB();
  const ci = { locale: "en", strength: 2 }; // case-insensitive exact match
  const { title, author } = parsed.data;
  if (await BookRequest.exists({ userId, status: "pending", title, author }).collation(ci)) {
    return { error: "You already have a pending request for this book." };
  }
  if ((await BookRequest.countDocuments({ userId, status: "pending" })) >= MAX_PENDING) {
    return { error: `You have ${MAX_PENDING} pending requests. Please wait until some are reviewed.` };
  }
  await BookRequest.create({ userId, ...parsed.data });
  revalidatePath("/", "layout");
  return { success: "Request sent. We'll review it soon." };
}

// ---- Admin ----

const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid id");

const StatusSchema = z
  .object({
    id: objectId,
    status: z.enum(["pending", "added", "declined"]),
    declineReason: z.enum(["duplicate", "other"]).optional(),
  })
  .refine((v) => v.status !== "declined" || v.declineReason, { message: "Choose a decline reason" });

export async function setRequestStatus(id, status, declineReason) {
  await requireAdmin();
  const parsed = StatusSchema.safeParse({ id, status, declineReason });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await connectDB();
  const declined = parsed.data.status === "declined";
  await BookRequest.updateOne(
    { _id: parsed.data.id },
    declined
      ? { $set: { status: "declined", declineReason: parsed.data.declineReason } }
      : { $set: { status: parsed.data.status }, $unset: { declineReason: "" } },
  );
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function deleteRequest(id) {
  await requireAdmin();
  if (!objectId.safeParse(id).success) return;
  await connectDB();
  await BookRequest.findByIdAndDelete(id);
  revalidatePath("/", "layout");
}
