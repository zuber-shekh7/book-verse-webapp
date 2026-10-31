import Link from "next/link";
import { deleteAuthor } from "@/actions/catalog";
import { DeleteButton } from "@/components/admin/delete-button";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireAdmin } from "@/lib/dal";
import { listAuthors } from "@/lib/catalog";

export default async function AuthorsPage() {
  await requireAdmin();
  const authors = await listAuthors();
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Authors</h1>
        <Button asChild>
          <Link href="/admin/authors/new">New author</Link>
        </Button>
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
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/authors/${a._id}/edit`}>Edit</Link>
                </Button>
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
