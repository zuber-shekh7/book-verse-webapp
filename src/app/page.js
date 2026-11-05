import Link from "next/link";
import { Suspense } from "react";
import { BookCard } from "@/components/book-card";
import { BookFilters } from "@/components/book-filters";
import { SiteHeader } from "@/components/site-header";
import { searchBooks } from "@/lib/catalog";

// Query params can repeat (?q=a&q=b); take the first value.
const first = (v) => (Array.isArray(v) ? v[0] : v) ?? "";

export default function Home({ searchParams }) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-[1200px] px-4 py-8 md:px-6">
        <h1 className="mb-8 font-heading text-4xl font-semibold">Discover books</h1>
        <Suspense fallback={<p className="text-muted-foreground">Loading books...</p>}>
          <Catalog searchParams={searchParams} />
        </Suspense>
      </main>
    </>
  );
}

async function Catalog({ searchParams }) {
  const sp = await searchParams;
  const q = first(sp.q);
  const books = await searchBooks({ q });
  const filtered = Boolean(q.trim());
  return (
    <>
      <BookFilters q={q} />
      {books.length === 0 ? (
        <p className="text-muted-foreground">
          {filtered ? (
            <>
              No books match your search.{" "}
              <Link href="/" className="text-primary underline-offset-4 hover:underline">Clear search</Link>
              {" · "}
              <Link
                href={`/request-book?title=${encodeURIComponent(q.trim().slice(0, 200))}`}
                className="text-primary underline-offset-4 hover:underline"
              >
                Can&apos;t find it? Request this book
              </Link>
            </>
          ) : (
            "No books yet."
          )}
        </p>
      ) : (
        <>
          {filtered && (
            <p className="mb-4 text-sm text-muted-foreground">
              {books.length} {books.length === 1 ? "book" : "books"} for &ldquo;{q.trim()}&rdquo;
            </p>
          )}
          <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {books.map((b) => (
              <li key={b._id}>
                <BookCard book={b} />
              </li>
            ))}
          </ul>
        </>
      )}
      <p className="mt-10 text-sm text-muted-foreground">
        Missing a book?{" "}
        <Link href="/request-book" className="text-primary underline-offset-4 hover:underline">Request it</Link>
      </p>
    </>
  );
}
