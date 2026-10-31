import "server-only";
import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;

// Reuse one connection across hot reloads in development.
const cached = (globalThis._mongoose ??= { conn: null, promise: null });

export async function connectDB() {
  if (!uri) {
    throw new Error("MONGODB_URI is not set. Add it to .env.local");
  }
  if (cached.conn) return cached.conn;
  cached.promise ??= mongoose.connect(uri, { bufferCommands: false });
  cached.conn = await cached.promise;
  return cached.conn;
}
