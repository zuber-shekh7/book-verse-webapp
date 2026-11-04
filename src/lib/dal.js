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

// Guard for reader-only pages. Admins are sent to the admin panel instead.
export async function requireReader() {
  const session = await readSession();
  if (!session) redirect("/login");
  if (session.role !== "reader") redirect("/admin/books");
  return session;
}

export async function getCurrentUser() {
  const { userId } = await requireReader();
  await connectDB();
  const user = await User.findById(userId).select("name email createdAt").lean();
  if (!user) redirect("/login");
  return { name: user.name || user.email, email: user.email, createdAt: user.createdAt.toISOString() };
}
