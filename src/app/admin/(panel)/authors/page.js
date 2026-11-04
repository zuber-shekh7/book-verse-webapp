import { AdminBreadcrumbs } from "@/components/admin/breadcrumbs";
import Link from "next/link";
import { Eye, Pencil } from "lucide-react";
import { deleteAuthor } from "@/actions/catalog";
import { StatusBadge } from "@/components/admin/status-badge";
import { DeleteButton } from "@/components/admin/delete-button";
import { buttonVariants } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireAdmin } from "@/lib/dal";
import { listAuthors } from "@/lib/catalog";

export default async function AuthorsPage() {
  await requireAdmin();
  const authors = await listAuthors();
  return (
    <section>
      <AdminBreadcrumbs items={[{ label: "Authors" }]} />
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Authors</h1>
        <Link href="/admin/authors/new" className={buttonVariants()}>New author</Link>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-0" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {authors.map((a) => (
            <TableRow key={a._id}>
              <TableCell>
                <Link href={`/admin/authors/${a._id}`} className="text-primary underline-offset-4 hover:underline">{a.name}</Link>
              </TableCell>
              <TableCell><StatusBadge isActive={a.isActive} /></TableCell>
              <TableCell className="flex justify-end gap-2">
                <Link href={`/admin/authors/${a._id}`} className={buttonVariants({ variant: "secondary", size: "sm" })} aria-label="View" title="View">
                  <Eye />
                  <span className="hidden sm:inline">View</span>
                </Link>
                <Link href={`/admin/authors/${a._id}/edit`} className={buttonVariants({ variant: "outline", size: "sm" })} aria-label="Edit" title="Edit">
                  <Pencil />
                  <span className="hidden sm:inline">Edit</span>
                </Link>
                <DeleteButton action={deleteAuthor.bind(null, a._id)} name={a.name} />
              </TableCell>
            </TableRow>
          ))}
          {authors.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-muted-foreground">
                No authors yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <p className="mt-2 text-xs text-muted-foreground">
        Authors that are used by a book cannot be deleted.
      </p>
    </section>
  );
}
