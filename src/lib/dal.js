import "server-only";
import { redirect } from "next/navigation";
import { readSession } from "./session";

// Authoritative admin check. Call at the top of every admin page and server action.
export async function requireAdmin() {
  const session = await readSession();
  if (!session || session.role !== "admin") redirect("/admin/login");
  return session;
}
