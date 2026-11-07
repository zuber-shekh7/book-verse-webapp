import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BookGrid } from "@/components/book-grid";
import { SiteHeader } from "@/components/site-header";
import { getAuthor, searchBooks } from "@/lib/catalog";

export default function AuthorPage({ params }) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-[1200px] px-4 py-8 md:px-6">
        <Link href="/authors" className="text-sm text-muted-foreground">&larr; All authors</Link>
        <Suspense fallback={<p className="mt-6 text-muted-foreground">Loading...</p>}>
          <AuthorBooks params={params} />
        </Suspense>
      </main>
    </>
  );
}

async function AuthorBooks({ params }) {
  const { id } = await params;
  const author = await getAuthor(id, { publicOnly: true });
  if (!author) notFound();
  const books = await searchBooks({ author: id });
  return (
    <>
      <h1 className="mt-4 font-heading text-4xl font-semibold">{author.name}</h1>
      {author.bio && <p className="mt-3 max-w-[65ch] whitespace-pre-line text-muted-foreground">{author.bio}</p>}
      <p className="mt-4 mb-6 text-sm text-muted-foreground">
        {books.length} {books.length === 1 ? "book" : "books"}
      </p>
      {books.length === 0 ? <p className="text-muted-foreground">No books by this author yet.</p> : <BookGrid books={books} />}
    </>
  );
}
