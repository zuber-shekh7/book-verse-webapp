import Link from "next/link";
import { BookOpen } from "lucide-react";
import { ReadingStatusControl } from "@/components/reading-status-control";

// viewer ("reader" | "guest" | "admin") enables the reading-list control; omit it to hide the control.
export function BookCard({ book, viewer, readingStatus }) {
  return (
    <div>
      <Link href={`/books/${book._id}`} className="group block">
        {book.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={book.coverUrl}
            alt={`Cover of ${book.title}`}
            className="aspect-[2/3] w-full rounded-md border object-cover shadow-sm transition-colors group-hover:border-primary"
          />
        ) : (
          <div className="flex aspect-[2/3] w-full flex-col items-center justify-center gap-2 rounded-md border bg-muted p-3 text-center text-muted-foreground">
            <BookOpen className="size-6" />
            <span className="font-heading text-sm">{book.title}</span>
          </div>
        )}
        <h2 className="mt-3 line-clamp-2 font-heading font-semibold leading-snug">{book.title}</h2>
        <p className="text-sm text-muted-foreground">{book.authors.map((a) => a.name).join(", ")}</p>
      </Link>
      {viewer && (
        <ReadingStatusControl bookId={book._id} status={readingStatus} viewer={viewer} className="mt-2" />
      )}
    </div>
  );
}
