import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BookGrid } from "@/components/book-grid";
import { SiteHeader } from "@/components/site-header";
import { getGenre, searchBooks } from "@/lib/catalog";

export default function GenrePage({ params }) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-[1200px] px-4 py-8 md:px-6">
        <Link href="/genres" className="text-sm text-muted-foreground">&larr; All genres</Link>
        <Suspense fallback={<p className="mt-6 text-muted-foreground">Loading...</p>}>
          <GenreBooks params={params} />
        </Suspense>
      </main>
    </>
  );
}

async function GenreBooks({ params }) {
  const { id } = await params;
  const genre = await getGenre(id, { publicOnly: true });
  if (!genre) notFound();
  const books = await searchBooks({ genre: id });
  return (
    <>
      <h1 className="mt-4 font-heading text-4xl font-semibold">{genre.name}</h1>
      <p className="mt-3 mb-6 text-sm text-muted-foreground">
        {books.length} {books.length === 1 ? "book" : "books"}
      </p>
      {books.length === 0 ? <p className="text-muted-foreground">No books in this genre yet.</p> : <BookGrid books={books} />}
    </>
  );
}
