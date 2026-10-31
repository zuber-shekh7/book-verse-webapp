import "server-only";
import { isValidObjectId } from "mongoose";
import { connectDB } from "./db";
import Author from "@/models/Author";
import Book from "@/models/Book";
import Genre from "@/models/Genre";

// Convert lean Mongo docs to plain, serializable objects.
const plain = (doc) => JSON.parse(JSON.stringify(doc));

export async function listBooks() {
  await connectDB();
  const books = await Book.find()
    .sort({ createdAt: -1 })
    .populate("authors", "name")
    .populate("genres", "name")
    .lean();
  return plain(books);
}

export async function getBook(id) {
  if (!isValidObjectId(id)) return null;
  await connectDB();
  const book = await Book.findById(id)
    .populate("authors", "name bio")
    .populate("genres", "name")
    .lean();
  return book ? plain(book) : null;
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
