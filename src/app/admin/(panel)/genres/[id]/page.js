import Link from "next/link";
import { Pencil } from "lucide-react";
import { notFound } from "next/navigation";
import { AdminBreadcrumbs } from "@/components/admin/breadcrumbs";
import { BookTable } from "@/components/admin/book-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { getGenre, listBooksByGenre } from "@/lib/catalog";
import { requireAdmin } from "@/lib/dal";

export default async function GenrePage({ params }) {
  await requireAdmin();
  const { id } = await params;
  const [genre, books] = await Promise.all([getGenre(id), listBooksByGenre(id)]);
  if (!genre) notFound();
  return (
    <section>
      <AdminBreadcrumbs items={[{ label: "Genres", href: "/admin/genres" }, { label: genre.name }]} />
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">{genre.name}</h1>
          <StatusBadge isActive={genre.isActive} />
        </div>
        <Link href={`/admin/genres/${id}/edit`} className={buttonVariants({ variant: "outline", size: "sm" })} aria-label="Edit" title="Edit">
          <Pencil />
          <span className="hidden sm:inline">Edit</span>
        </Link>
      </div>
      <h2 className="mb-2 text-lg font-semibold">Books ({books.length})</h2>
      <BookTable books={books} empty="No books in this genre yet." />
    </section>
  );
}
