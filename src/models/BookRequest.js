import mongoose from "mongoose";
import "./User";

export const REQUEST_STATUS_VALUES = ["pending", "added", "declined"];

// One row per submission. Author and genre are plain text: a request is a snapshot of what the reader asked for.
const BookRequestSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    author: { type: String, required: true, trim: true, maxlength: 120 },
    genre: { type: String, required: true, trim: true, maxlength: 80 },
    status: { type: String, enum: REQUEST_STATUS_VALUES, default: "pending", index: true },
    declineReason: { type: String, enum: ["duplicate", "other"] }, // only when declined
  },
  { timestamps: true },
);

export default mongoose.models.BookRequest || mongoose.model("BookRequest", BookRequestSchema);
