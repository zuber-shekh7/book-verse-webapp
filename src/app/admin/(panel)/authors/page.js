import { AdminBreadcrumbs } from "@/components/admin/breadcrumbs";
import Link from "next/link";
import { deleteAuthor } from "@/actions/catalog";
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
            <TableHead className="w-40" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {authors.map((a) => (
            <TableRow key={a._id}>
              <TableCell>{a.name}</TableCell>
              <TableCell className="flex justify-end gap-2">
                <Link href={`/admin/authors/${a._id}/edit`} className={buttonVariants({ variant: "outline", size: "sm" })}>
                  Edit
                </Link>
                <DeleteButton action={deleteAuthor.bind(null, a._id)} />
              </TableCell>
            </TableRow>
          ))}
          {authors.length === 0 && (
            <TableRow>
              <TableCell colSpan={2} className="text-muted-foreground">
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
