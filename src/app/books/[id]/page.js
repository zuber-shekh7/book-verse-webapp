import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { getBook } from "@/lib/catalog";

export default function BookPage({ params }) {
  return (
    <>
    <SiteHeader />
    <main className="mx-auto w-full max-w-[1200px] px-4 py-6 md:px-6">
      <Link href="/" className="text-sm text-muted-foreground">
        &larr; All books
      </Link>
      <Suspense fallback={<p className="mt-6 text-muted-foreground">Loading...</p>}>
        <BookDetail params={params} />
      </Suspense>
    </main>
    </>
  );
}

async function BookDetail({ params }) {
  const { id } = await params;
  const book = await getBook(id);
  if (!book) notFound();

  return (
    <article className="mt-6 flex flex-col gap-8 md:flex-row">
      {book.coverUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={book.coverUrl}
          alt={`Cover of ${book.title}`}
          className="aspect-[2/3] w-full max-w-[280px] shrink-0 rounded-md object-cover shadow-sm"
        />
      )}
      <div className="grid max-w-[65ch] content-start gap-3">
        <h1 className="font-heading text-3xl font-semibold">{book.title}</h1>
        <p className="text-muted-foreground">by {book.authors.map((a) => a.name).join(", ")}</p>
        {book.genres.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {book.genres.map((g) => (
              <Badge key={g._id} variant="secondary">
                {g.name}
              </Badge>
            ))}
          </div>
        )}
        {book.description && <p className="whitespace-pre-line">{book.description}</p>}
        <dl className="text-sm text-muted-foreground">
          {book.publishedYear && <div>Published: {book.publishedYear}</div>}
          {book.isbn && <div>ISBN: <span className="font-mono">{book.isbn}</span></div>}
        </dl>
      </div>
    </article>
  );
}
