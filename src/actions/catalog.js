"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/dal";
import { connectDB } from "@/lib/db";
import Author from "@/models/Author";
import Book from "@/models/Book";
import Genre from "@/models/Genre";

const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid id");

const AuthorSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  bio: z.string().trim().default(""),
});

const GenreSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
});

const BookSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  authors: z.array(objectId).min(1, "Select at least one author"),
  genres: z.array(objectId).default([]),
  description: z.string().trim().default(""),
  coverUrl: z.union([z.literal(""), z.url("Cover must be a valid URL")]).default(""),
  isbn: z.string().trim().default(""),
  publishedYear: z.preprocess(
    (v) => (v === "" || v == null ? undefined : Number(v)),
    z.number().int().min(0).max(3000).optional(),
  ),
});

function fieldsOf(formData, multi = []) {
  const data = Object.fromEntries(formData);
  for (const key of multi) data[key] = formData.getAll(key);
  return data;
}

function failure(error) {
  return { error: error.issues[0].message };
}

// Generic create/update/delete helpers keep each entity's actions tiny.
function crud({ model, schema, multi = [], listPath }) {
  return {
    async save(id, formData) {
      await requireAdmin();
      const parsed = schema.safeParse(fieldsOf(formData, multi));
      if (!parsed.success) return failure(parsed.error);
      await connectDB();
      try {
        if (id) await model.findByIdAndUpdate(id, parsed.data);
        else await model.create(parsed.data);
      } catch (e) {
        if (e.code === 11000) return { error: "That name already exists" };
        throw e;
      }
      revalidatePath("/", "layout");
      redirect(listPath);
    },
    async remove(id) {
      await requireAdmin();
      await connectDB();
      await model.findByIdAndDelete(id);
      revalidatePath("/", "layout");
    },
  };
}

const authors = crud({ model: Author, schema: AuthorSchema, listPath: "/admin/authors" });
const genres = crud({ model: Genre, schema: GenreSchema, listPath: "/admin/genres" });
const books = crud({
  model: Book,
  schema: BookSchema,
  multi: ["authors", "genres"],
  listPath: "/admin/books",
});

export async function saveAuthor(id, _prev, formData) {
  return authors.save(id, formData);
}
export async function deleteAuthor(id) {
  await requireAdmin();
  await connectDB();
  if (await Book.exists({ authors: id })) return;
  await authors.remove(id);
}

export async function saveGenre(id, _prev, formData) {
  return genres.save(id, formData);
}
export async function deleteGenre(id) {
  await requireAdmin();
  await connectDB();
  if (await Book.exists({ genres: id })) return;
  await genres.remove(id);
}

export async function saveBook(id, _prev, formData) {
  return books.save(id, formData);
}
export async function deleteBook(id) {
  return books.remove(id);
}
