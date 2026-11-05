import "server-only";
import { isValidObjectId } from "mongoose";
import { connectDB } from "./db";
import Author from "@/models/Author";
import Book from "@/models/Book";
import Genre from "@/models/Genre";

// Convert lean Mongo docs to plain, serializable objects.
const plain = (doc) => JSON.parse(JSON.stringify(doc));

// Readers only see active content. Inactive authors/genres are left off a book's lists.
const ACTIVE = { match: { isActive: true } };

// Filter for books readers may see: the book is active and has at least one active author.
export async function publicBookFilter() {
  await connectDB();
  return { isActive: true, authors: { $in: await Author.find({ isActive: true }).distinct("_id") } };
}

export async function listBooks() {
  await connectDB();
  const books = await Book.find()
    .sort({ createdAt: -1 })
    .populate("authors", "name")
    .populate("genres", "name")
    .lean();
  return plain(books);
}

// publicOnly: reader view. Returns null for a draft book or one with no active author.
export async function getBook(id, { publicOnly = false } = {}) {
  if (!isValidObjectId(id)) return null;
  await connectDB();
  const book = await Book.findOne({ _id: id, ...(publicOnly && { isActive: true }) })
    .populate({ path: "authors", select: "name bio isActive", ...(publicOnly && ACTIVE) })
    .populate({ path: "genres", select: "name isActive", ...(publicOnly && ACTIVE) })
    .lean();
  if (!book || (publicOnly && book.authors.length === 0)) return null;
  return plain(book);
}

export async function listAuthors() {
  await connectDB();
  return plain(await Author.find().sort({ name: 1 }).lean());
}

export async function getAuthor(id) {
  if (!isValidObjectId(id)) return null;
  await connectDB();
  const author = await Author.findById(id).lean();
  return author ? plain(author) : null;
}

export async function listGenres() {
  await connectDB();
  return plain(await Genre.find().sort({ name: 1 }).lean());
}

export async function getGenre(id) {
  if (!isValidObjectId(id)) return null;
  await connectDB();
  const genre = await Genre.findById(id).lean();
  return genre ? plain(genre) : null;
}

async function listBooksBy(field, id) {
  if (!isValidObjectId(id)) return [];
  await connectDB();
  const books = await Book.find({ [field]: id })
    .sort({ title: 1 })
    .populate("authors", "name")
    .populate("genres", "name")
    .lean();
  return plain(books);
}

export const listBooksByAuthor = (id) => listBooksBy("authors", id);
export const listBooksByGenre = (id) => listBooksBy("genres", id);

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Public catalog search. q matches title or author name; genre/author are ObjectId strings.
export async function searchBooks({ q = "", genre = "", author = "" } = {}) {
  await connectDB();
  const { isActive, authors: activeAuthors } = await publicBookFilter();
  const filter = { isActive, $and: [{ authors: activeAuthors }] };
  const term = q.trim().slice(0, 100);
  if (term) {
    const rx = new RegExp(escapeRegex(term), "i");
    const authorIds = await Author.find({ name: rx, isActive: true }).distinct("_id");
    filter.$and.push({ $or: [{ title: rx }, { authors: { $in: authorIds } }] });
  }
  if (isValidObjectId(genre)) filter.$and.push({ genres: genre });
  if (isValidObjectId(author)) filter.$and.push({ authors: author });
  const books = await Book.find(filter)
    .sort({ createdAt: -1 })
    .populate({ path: "authors", select: "name", ...ACTIVE })
    .populate({ path: "genres", select: "name", ...ACTIVE })
    .lean();
  return plain(books);
}

// Suggestions for the book request form: active records whose name matches, first few only.
async function searchByName(Model, q, limit = 5) {
  const term = q.trim().slice(0, 100);
  if (!term) return [];
  await connectDB();
  const rows = await Model.find({ name: new RegExp(escapeRegex(term), "i"), isActive: true })
    .sort({ name: 1 })
    .limit(limit)
    .select("name")
    .lean();
  return plain(rows);
}

export const searchAuthors = (q) => searchByName(Author, q);
export const searchGenres = (q) => searchByName(Genre, q);
