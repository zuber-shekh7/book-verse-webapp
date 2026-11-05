import Link from "next/link";
import { Suspense } from "react";
import { RequestStatusBadge } from "@/components/request-status-badge";
import { SiteHeader } from "@/components/site-header";
import { buttonVariants } from "@/components/ui/button";
import { requireReader } from "@/lib/dal";
import { listRequestsForUser } from "@/lib/book-requests";

export const metadata = { title: "Book requests | BookVerse" };

const fmt = (d) => new Date(d).toLocaleDateString("en-US", { dateStyle: "medium" });

export default function RequestsPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-[1200px] px-4 py-8 md:px-6">
        <Link href="/dashboard" className="text-sm text-muted-foreground">&larr; Dashboard</Link>
        <div className="mt-4 mb-6 flex items-center justify-between gap-4">
          <h1 className="font-heading text-3xl font-semibold">Book requests</h1>
          <Link href="/request-book" className={buttonVariants({ size: "sm" })}>New request</Link>
        </div>
        <Suspense fallback={<p className="text-muted-foreground">Loading...</p>}>
          <Requests />
        </Suspense>
      </main>
    </>
  );
}

async function Requests() {
  const { userId } = await requireReader();
  const requests = await listRequestsForUser(userId);
  if (requests.length === 0) {
    return <p className="text-muted-foreground">You haven&apos;t requested any books yet.</p>;
  }
  return (
    <ul className="grid max-w-2xl gap-3">
      {requests.map((r) => (
        <li key={r._id} className="flex items-start justify-between gap-4 rounded-lg border p-4">
          <div>
            <p className="font-heading font-semibold">{r.title}</p>
            <p className="text-sm text-muted-foreground">
              {r.author} &middot; {r.genre} &middot; {fmt(r.createdAt)}
            </p>
            {r.status === "declined" && r.declineReason === "duplicate" && (
              <p className="mt-1 text-sm text-muted-foreground">Someone already requested this book.</p>
            )}
          </div>
          <RequestStatusBadge status={r.status} declineReason={r.declineReason} />
        </li>
      ))}
    </ul>
  );
}
