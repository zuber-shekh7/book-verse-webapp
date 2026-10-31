import mongoose from "mongoose";
import "./Author";
import "./Genre";

const BookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    authors: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Author" }],
      validate: (v) => v.length > 0,
    },
    genres: [{ type: mongoose.Schema.Types.ObjectId, ref: "Genre" }],
    description: { type: String, default: "", trim: true },
    coverUrl: { type: String, default: "", trim: true },
    isbn: { type: String, default: "", trim: true },
    publishedYear: { type: Number },
  },
  { timestamps: true },
);

export default mongoose.models.Book || mongoose.model("Book", BookSchema);
