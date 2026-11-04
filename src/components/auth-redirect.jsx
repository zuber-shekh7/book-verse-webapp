import { redirect } from "next/navigation";
import { readSession } from "@/lib/session";

// Renders nothing; sends already signed-in readers to their dashboard.
export async function AuthRedirect() {
  const session = await readSession();
  if (session?.role === "reader") redirect("/dashboard");
  return null;
}
