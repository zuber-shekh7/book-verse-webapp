import Link from "next/link";
import { Suspense } from "react";
import { BookCard } from "@/components/book-card";
import { SiteHeader } from "@/components/site-header";
import { requireReader } from "@/lib/dal";
import { countByStatus, listEntries } from "@/lib/reading-list";
import { READING_STATUSES, isReadingStatus } from "@/lib/reading-status";
import { cn } from "@/lib/utils";

export const metadata = { title: "Reading list | BookVerse" };

const TABS = [{ value: "all", label: "All" }, ...READING_STATUSES];

export default function ReadingListPage({ searchParams }) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-[1200px] px-4 py-8 md:px-6">
        <Link href="/dashboard" className="text-sm text-muted-foreground">&larr; Dashboard</Link>
        <h1 className="mt-4 mb-6 font-heading text-3xl font-semibold">Reading list</h1>
        <Suspense fallback={<p className="text-muted-foreground">Loading...</p>}>
          <ReadingList searchParams={searchParams} />
        </Suspense>
      </main>
    </>
  );
}

async function ReadingList({ searchParams }) {
  const { userId } = await requireReader();
  const raw = (await searchParams).status;
  const status = isReadingStatus(raw) ? raw : "all";
  const [entries, counts] = await Promise.all([
    listEntries(userId, status === "all" ? undefined : status),
    countByStatus(userId),
  ]);
  const label = TABS.find((t) => t.value === status).label;

  return (
    <>
      <nav aria-label="Filter by status" className="mb-8 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <Link
            key={t.value}
            href={t.value === "all" ? "/dashboard/reading-list" : `/dashboard/reading-list?status=${t.value}`}
            aria-current={t.value === status ? "page" : undefined}
            className={cn(
              "rounded-full px-3 py-1 text-sm transition-colors",
              t.value === status ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label} <span className="opacity-80">({counts[t.value]})</span>
          </Link>
        ))}
      </nav>
      {entries.length === 0 ? (
        <p className="text-muted-foreground">
          {status === "all" ? (
            <>
              Your reading list is empty.{" "}
              <Link href="/" className="text-primary underline-offset-4 hover:underline">Browse books</Link> to add some.
            </>
          ) : (
            <>Nothing marked &ldquo;{label}&rdquo; yet.</>
          )}
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {entries.map((e) => (
            <li key={e.book._id}>
              <BookCard book={e.book} viewer="reader" readingStatus={e.status} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
