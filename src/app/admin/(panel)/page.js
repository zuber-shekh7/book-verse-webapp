import Link from "next/link";
import { AdminBreadcrumbs } from "@/components/admin/breadcrumbs";
import { StatusBadge } from "@/components/admin/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardStats } from "@/lib/admin-stats";
import { listRecentPendingRequests } from "@/lib/book-requests";
import { listDraftBooks } from "@/lib/catalog";
import { requireAdmin } from "@/lib/dal";
import { listRecentReaders } from "@/lib/users";

const fmt = (d) => new Date(d).toLocaleDateString("en-US", { dateStyle: "medium" });

export default async function AdminDashboard() {
  await requireAdmin();
  const [stats, drafts, requests, readers] = await Promise.all([
    getDashboardStats(),
    listDraftBooks(),
    listRecentPendingRequests(),
    listRecentReaders(),
  ]);
  return (
    <section>
      <AdminBreadcrumbs items={[{ label: "Dashboard" }]} />
      <h1 className="mb-4 text-2xl font-bold">Dashboard</h1>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard href="/admin/books" title="Books" value={stats.books.active} note={`${stats.books.draft} draft`} />
        <StatCard href="/admin/authors" title="Authors" value={stats.authors.active} note={`${stats.authors.draft} draft`} />
        <StatCard href="/admin/genres" title="Genres" value={stats.genres.active} note={`${stats.genres.draft} draft`} />
        <StatCard
          href="/admin/users"
          title="Readers"
          value={stats.readers}
          note={`${stats.newReaders} new this week · ${stats.deactivated} deactivated`}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ListCard title="Pending requests" href="/admin/requests" empty="No pending requests." isEmpty={requests.length === 0}>
          {requests.map((r) => (
            <li key={r._id}>
              <p className="font-medium">{r.title}</p>
              <p className="text-muted-foreground">
                {r.author} &middot; {r.userId ? r.userId.name || r.userId.email : "Deleted user"} &middot; {fmt(r.createdAt)}
              </p>
            </li>
          ))}
        </ListCard>

        <ListCard title="Draft books" href="/admin/books" empty="No drafts. Everything is published." isEmpty={drafts.length === 0}>
          {drafts.map((b) => (
            <li key={b._id}>
              <Link href={`/admin/books/${b._id}`} className="font-medium text-primary underline-offset-4 hover:underline">{b.title}</Link>
              <p className="text-muted-foreground">
                {b.authors.map((a) => a.name).join(", ")} &middot; {fmt(b.createdAt)}
              </p>
            </li>
          ))}
        </ListCard>

        <ListCard title="Newest readers" href="/admin/users" empty="No readers yet." isEmpty={readers.length === 0}>
          {readers.map((u) => (
            <li key={u._id} className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <Link href={`/admin/users/${u._id}`} className="block truncate font-medium text-primary underline-offset-4 hover:underline">
                  {u.name || u.email}
                </Link>
                <p className="text-muted-foreground">Joined {fmt(u.createdAt)}</p>
              </div>
              {u.isActive === false && <StatusBadge isActive={false} inactiveLabel="Deactivated" />}
            </li>
          ))}
        </ListCard>
      </div>
    </section>
  );
}

function StatCard({ href, title, value, note }) {
  return (
    <Link href={href} className="rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
      <Card className="h-full transition-colors hover:bg-muted/50">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-heading text-3xl font-semibold">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{note}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

function ListCard({ title, href, empty, isEmpty, children }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle>{title}</CardTitle>
          <Link href={href} className="text-xs text-primary underline-offset-4 hover:underline">View all</Link>
        </div>
      </CardHeader>
      <CardContent>
        {isEmpty ? <p className="text-muted-foreground">{empty}</p> : <ul className="grid gap-3 text-sm">{children}</ul>}
      </CardContent>
    </Card>
  );
}
