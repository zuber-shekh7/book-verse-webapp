import mongoose from "mongoose";

const AuthorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    bio: { type: String, default: "", trim: true },
    isActive: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

export default mongoose.models.Author || mongoose.model("Author", AuthorSchema);
