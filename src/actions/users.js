"use server";

import { isValidObjectId } from "mongoose";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/dal";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

// Readers only: admin accounts cannot be deactivated from the panel.
export async function setUserActive(id, isActive) {
  await requireAdmin();
  if (!isValidObjectId(id)) return { error: "Invalid user" };
  await connectDB();
  const res = await User.updateOne({ _id: id, role: "reader" }, { isActive: Boolean(isActive) });
  if (!res.matchedCount) return { error: "Reader not found" };
  revalidatePath("/admin/users", "layout");
  return { ok: true };
}
