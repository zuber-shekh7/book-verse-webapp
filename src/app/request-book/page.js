import { Suspense } from "react";
import Link from "next/link";
import { submitBookRequest } from "@/actions/book-requests";
import { RequestBookForm } from "@/components/request-book-form";
import { SiteHeader } from "@/components/site-header";
import { requireReader } from "@/lib/dal";

export const metadata = { title: "Request a book | BookVerse" };

// Query params can repeat (?title=a&title=b); take the first value.
const first = (v) => (Array.isArray(v) ? v[0] : v) ?? "";

export default function RequestBookPage({ searchParams }) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-xl px-4 py-12">
        <h1 className="mb-2 font-heading text-3xl font-semibold">Request a book</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Can&apos;t find a book? Tell us what you&apos;re looking for and we&apos;ll consider adding it.{" "}
          <Link href="/dashboard/requests" className="text-primary underline-offset-4 hover:underline">Your requests</Link>
        </p>
        <Suspense fallback={<p className="text-muted-foreground">Loading...</p>}>
          <RequestForm searchParams={searchParams} />
        </Suspense>
      </main>
    </>
  );
}

async function RequestForm({ searchParams }) {
  await requireReader();
  const title = first((await searchParams).title).slice(0, 200);
  return <RequestBookForm action={submitBookRequest} defaultTitle={title} />;
}
