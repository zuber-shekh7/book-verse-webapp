import Link from "next/link";
import { deleteGenre } from "@/actions/catalog";
import { DeleteButton } from "@/components/admin/delete-button";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireAdmin } from "@/lib/dal";
import { listGenres } from "@/lib/catalog";

export default async function GenresPage() {
  await requireAdmin();
  const genres = await listGenres();
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Genres</h1>
        <Button asChild>
          <Link href="/admin/genres/new">New genre</Link>
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
          {genres.map((g) => (
            <TableRow key={g._id}>
              <TableCell>{g.name}</TableCell>
              <TableCell className="flex justify-end gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/genres/${g._id}/edit`}>Edit</Link>
                </Button>
                <DeleteButton action={deleteGenre.bind(null, g._id)} />
              </TableCell>
            </TableRow>
          ))}
          {genres.length === 0 && (
            <TableRow>
              <TableCell colSpan={2} className="text-muted-foreground">
                No genres yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <p className="mt-2 text-xs text-muted-foreground">
        Genres that are used by a book cannot be deleted.
      </p>
    </section>
  );
}
