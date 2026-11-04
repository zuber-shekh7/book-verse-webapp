import mongoose from "mongoose";

const GenreSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    isActive: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

export default mongoose.models.Genre || mongoose.model("Genre", GenreSchema);
