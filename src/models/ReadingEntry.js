import mongoose from "mongoose";
import "./Book";
import "./User";

export const READING_STATUS_VALUES = ["wishlist", "reading", "on_hold", "dropped", "completed"];

// One row per (reader, book). The unique index keeps a book from being listed twice.
const ReadingEntrySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    status: { type: String, enum: READING_STATUS_VALUES, required: true },
  },
  { timestamps: true },
);

ReadingEntrySchema.index({ userId: 1, bookId: 1 }, { unique: true });
ReadingEntrySchema.index({ userId: 1, status: 1 });

export default mongoose.models.ReadingEntry || mongoose.model("ReadingEntry", ReadingEntrySchema);
