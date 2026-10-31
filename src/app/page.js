import Link from "next/link";
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listBooks } from "@/lib/catalog";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl p-6">
      <h1 className="mb-6 text-3xl font-bold">BookVerse</h1>
      <Suspense fallback={<p className="text-muted-foreground">Loading books...</p>}>
        <BookList />
      </Suspense>
    </main>
  );
}

async function BookList() {
  const books = await listBooks();
  if (books.length === 0) {
    return <p className="text-muted-foreground">No books yet.</p>;
  }
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {books.map((b) => (
        <li key={b._id}>
          <Link href={`/books/${b._id}`}>
            <Card className="h-full transition-colors hover:bg-muted/50">
              <CardHeader>
                <CardTitle>{b.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {b.authors.map((a) => a.name).join(", ")}
                </p>
              </CardHeader>
              {b.genres.length > 0 && (
                <CardContent className="text-xs text-muted-foreground">
                  {b.genres.map((g) => g.name).join(" · ")}
                </CardContent>
              )}
            </Card>
          </Link>
        </li>
      ))}
    </ul>
  );
}
