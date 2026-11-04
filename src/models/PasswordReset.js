import mongoose from "mongoose";

// Only the SHA-256 hash of the emailed token is stored. Expired rows are removed by the TTL index.
const PasswordResetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  tokenHash: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
});

export default mongoose.models.PasswordReset || mongoose.model("PasswordReset", PasswordResetSchema);
