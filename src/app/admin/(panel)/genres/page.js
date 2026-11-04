import { AdminBreadcrumbs } from "@/components/admin/breadcrumbs";
import Link from "next/link";
import { Eye, Pencil } from "lucide-react";
import { deleteGenre } from "@/actions/catalog";
import { StatusBadge } from "@/components/admin/status-badge";
import { DeleteButton } from "@/components/admin/delete-button";
import { buttonVariants } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireAdmin } from "@/lib/dal";
import { listGenres } from "@/lib/catalog";

export default async function GenresPage() {
  await requireAdmin();
  const genres = await listGenres();
  return (
    <section>
      <AdminBreadcrumbs items={[{ label: "Genres" }]} />
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Genres</h1>
        <Link href="/admin/genres/new" className={buttonVariants()}>New genre</Link>
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
          {genres.map((g) => (
            <TableRow key={g._id}>
              <TableCell>
                <Link href={`/admin/genres/${g._id}`} className="text-primary underline-offset-4 hover:underline">{g.name}</Link>
              </TableCell>
              <TableCell><StatusBadge isActive={g.isActive} /></TableCell>
              <TableCell className="flex justify-end gap-2">
                <Link href={`/admin/genres/${g._id}`} className={buttonVariants({ variant: "secondary", size: "sm" })} aria-label="View" title="View">
                  <Eye />
                  <span className="hidden sm:inline">View</span>
                </Link>
                <Link href={`/admin/genres/${g._id}/edit`} className={buttonVariants({ variant: "outline", size: "sm" })} aria-label="Edit" title="Edit">
                  <Pencil />
                  <span className="hidden sm:inline">Edit</span>
                </Link>
                <DeleteButton action={deleteGenre.bind(null, g._id)} name={g.name} />
              </TableCell>
            </TableRow>
          ))}
          {genres.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-muted-foreground">
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
