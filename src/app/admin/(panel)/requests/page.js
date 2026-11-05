import Link from "next/link";
import { AdminBreadcrumbs } from "@/components/admin/breadcrumbs";
import { RequestActions } from "@/components/admin/request-actions";
import { RequestStatusBadge } from "@/components/request-status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { listRequests } from "@/lib/book-requests";
import { requireAdmin } from "@/lib/dal";
import { cn } from "@/lib/utils";

const TABS = [
  { value: "pending", label: "Pending" },
  { value: "added", label: "Added" },
  { value: "declined", label: "Declined" },
  { value: "all", label: "All" },
];

const fmt = (d) => new Date(d).toLocaleDateString("en-US", { dateStyle: "medium" });

export default async function RequestsPage({ searchParams }) {
  await requireAdmin();
  const raw = (await searchParams).status;
  const status = TABS.some((t) => t.value === raw) ? raw : "pending";
  const requests = await listRequests(status);
  return (
    <section>
      <AdminBreadcrumbs items={[{ label: "Requests" }]} />
      <h1 className="mb-4 text-2xl font-bold">Book requests</h1>
      <nav aria-label="Filter by status" className="mb-4 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <Link
            key={t.value}
            href={t.value === "pending" ? "/admin/requests" : `/admin/requests?status=${t.value}`}
            aria-current={t.value === status ? "page" : undefined}
            className={cn(
              "rounded-full px-3 py-1 text-sm transition-colors",
              t.value === status ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
          </Link>
        ))}
      </nav>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Genre</TableHead>
            <TableHead>Requested by</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-0" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((r) => (
            <TableRow key={r._id}>
              <TableCell className="font-medium">{r.title}</TableCell>
              <TableCell>{r.author}</TableCell>
              <TableCell>{r.genre}</TableCell>
              <TableCell>
                {r.userId ? (
                  <Link href={`/admin/users/${r.userId._id}`} className="text-primary underline-offset-4 hover:underline">
                    {r.userId.name || r.userId.email}
                  </Link>
                ) : (
                  <span className="text-muted-foreground">Deleted user</span>
                )}
              </TableCell>
              <TableCell>{fmt(r.createdAt)}</TableCell>
              <TableCell><RequestStatusBadge status={r.status} declineReason={r.declineReason} /></TableCell>
              <TableCell><RequestActions request={r} /></TableCell>
            </TableRow>
          ))}
          {requests.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-muted-foreground">No requests here.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <p className="mt-2 text-xs text-muted-foreground">
        Requests for the same book appear next to each other. Mark repeats as Duplicate.
      </p>
    </section>
  );
}
