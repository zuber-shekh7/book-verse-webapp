import { redirect } from "next/navigation";
import { readSession } from "@/lib/session";

// Renders nothing; sends already signed-in users to their own home (readers: dashboard, admins: panel).
export async function AuthRedirect() {
  const session = await readSession();
  if (session?.role === "reader") redirect("/dashboard");
  if (session?.role === "admin") redirect("/admin/books");
  return null;
}
