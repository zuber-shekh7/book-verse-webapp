import { AdminBreadcrumbs } from "@/components/admin/breadcrumbs";
import Link from "next/link";
import { Eye, Pencil } from "lucide-react";
import { deleteBook } from "@/actions/catalog";
import { StatusBadge } from "@/components/admin/status-badge";
import { DeleteButton } from "@/components/admin/delete-button";
import { buttonVariants } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireAdmin } from "@/lib/dal";
import { listBooks } from "@/lib/catalog";

export default async function BooksPage() {
  await requireAdmin();
  const books = await listBooks();
  return (
    <section>
      <AdminBreadcrumbs items={[{ label: "Books" }]} />
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Books</h1>
        <Link href="/admin/books/new" className={buttonVariants()}>New book</Link>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Authors</TableHead>
            <TableHead>Genres</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-0" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {books.map((b) => (
            <TableRow key={b._id}>
              <TableCell>
                <Link href={`/admin/books/${b._id}`} className="text-primary underline-offset-4 hover:underline">{b.title}</Link>
              </TableCell>
              <TableCell>{b.authors.map((a) => a.name).join(", ")}</TableCell>
              <TableCell>{b.genres.map((g) => g.name).join(", ")}</TableCell>
              <TableCell><StatusBadge isActive={b.isActive} /></TableCell>
              <TableCell className="flex justify-end gap-2">
                <Link href={`/admin/books/${b._id}`} className={buttonVariants({ variant: "secondary", size: "sm" })} aria-label="View" title="View">
                  <Eye />
                  <span className="hidden sm:inline">View</span>
                </Link>
                <Link href={`/admin/books/${b._id}/edit`} className={buttonVariants({ variant: "outline", size: "sm" })} aria-label="Edit" title="Edit">
                  <Pencil />
                  <span className="hidden sm:inline">Edit</span>
                </Link>
                <DeleteButton action={deleteBook.bind(null, b._id)} name={b.title} />
              </TableCell>
            </TableRow>
          ))}
          {books.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-muted-foreground">
                No books yet. Add an author first, then a book.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </section>
  );
}
