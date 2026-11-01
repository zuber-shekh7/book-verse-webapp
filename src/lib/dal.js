import "server-only";
import { redirect } from "next/navigation";
import { connectDB } from "./db";
import { readSession } from "./session";
import User from "@/models/User";

// Authoritative admin check. Call at the top of every admin page and server action.
export async function requireAdmin() {
  const session = await readSession();
  if (!session || session.role !== "admin") redirect("/admin/login");
  return session;
}

export async function getAdminEmail() {
  const { userId } = await requireAdmin();
  await connectDB();
  const user = await User.findById(userId).select("email").lean();
  return user?.email ?? "";
}
