import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Suspense } from "react";
import { SiteHeader } from "@/components/site-header";
import { listBooks } from "@/lib/catalog";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-[1200px] px-4 py-8 md:px-6">
        <h1 className="mb-8 font-heading text-4xl font-semibold">Discover books</h1>
        <Suspense fallback={<p className="text-muted-foreground">Loading books...</p>}>
          <BookList />
        </Suspense>
      </main>
    </>
  );
}

async function BookList() {
  const books = await listBooks();
  if (books.length === 0) {
    return <p className="text-muted-foreground">No books yet.</p>;
  }
  return (
    <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {books.map((b) => (
        <li key={b._id}>
          <Link href={`/books/${b._id}`} className="group block">
            {b.coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={b.coverUrl}
                alt={`Cover of ${b.title}`}
                className="aspect-[2/3] w-full rounded-md border object-cover shadow-sm transition-colors group-hover:border-primary"
              />
            ) : (
              <div className="flex aspect-[2/3] w-full flex-col items-center justify-center gap-2 rounded-md border bg-muted p-3 text-center text-muted-foreground">
                <BookOpen className="size-6" />
                <span className="font-heading text-sm">{b.title}</span>
              </div>
            )}
            <h2 className="mt-3 line-clamp-2 font-heading font-semibold leading-snug">
              {b.title}
            </h2>
            <p className="text-sm text-muted-foreground">
              {b.authors.map((a) => a.name).join(", ")}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
