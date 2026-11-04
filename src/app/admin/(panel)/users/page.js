import Link from "next/link";
import { Eye } from "lucide-react";
import { AdminBreadcrumbs } from "@/components/admin/breadcrumbs";
import { RoleBadge } from "@/components/admin/role-badge";
import { buttonVariants } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireAdmin } from "@/lib/dal";
import { listUsers } from "@/lib/users";

const fmt = (d) => new Date(d).toLocaleDateString("en-US", { dateStyle: "medium" });

export default async function UsersPage() {
  await requireAdmin();
  const users = await listUsers();
  return (
    <section>
      <AdminBreadcrumbs items={[{ label: "Users" }]} />
      <h1 className="mb-4 text-2xl font-bold">Users ({users.length})</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="w-0" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((u) => (
            <TableRow key={u._id}>
              <TableCell>
                <Link href={`/admin/users/${u._id}`} className="text-primary underline-offset-4 hover:underline">
                  {u.name || "—"}
                </Link>
              </TableCell>
              <TableCell>{u.email}</TableCell>
              <TableCell><RoleBadge role={u.role} /></TableCell>
              <TableCell>{fmt(u.createdAt)}</TableCell>
              <TableCell className="flex justify-end">
                <Link
                  href={`/admin/users/${u._id}`}
                  className={buttonVariants({ variant: "secondary", size: "sm" })}
                  aria-label="View"
                  title="View"
                >
                  <Eye />
                  <span className="hidden sm:inline">View</span>
                </Link>
              </TableCell>
            </TableRow>
          ))}
          {users.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-muted-foreground">No users yet.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </section>
  );
}
