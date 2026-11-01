import Link from "next/link";
import { logout } from "@/actions/auth";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Admin | BookVerse" };

export default function AdminLayout({ children }) {
  return (
    <div className="mx-auto w-full max-w-5xl p-6">
      <header className="mb-8 flex items-center justify-between border-b pb-4">
        <nav className="flex gap-4 text-sm font-medium">
          <Link href="/admin/books">Books</Link>
          <Link href="/admin/authors">Authors</Link>
          <Link href="/admin/genres">Genres</Link>
          <Link href="/" className="text-muted-foreground">
            View site
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <form action={logout}>
            <Button type="submit" variant="outline" size="sm">
              Log out
            </Button>
          </form>
        </div>
      </header>
      {children}
    </div>
  );
}
