/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Pencil } from "lucide-react";
import { notFound } from "next/navigation";
import { AdminBreadcrumbs } from "@/components/admin/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/admin/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { getBook } from "@/lib/catalog";
import { requireAdmin } from "@/lib/dal";

const fmt = (d) => new Date(d).toLocaleDateString("en-US", { dateStyle: "medium" });

export default async function BookPage({ params }) {
  await requireAdmin();
  const { id } = await params;
  const book = await getBook(id);
  if (!book) notFound();
  return (
    <section>
      <AdminBreadcrumbs items={[{ label: "Books", href: "/admin/books" }, { label: book.title }]} />
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">{book.title}</h1>
          <StatusBadge isActive={book.isActive} />
        </div>
        <Link href={`/admin/books/${id}/edit`} className={buttonVariants({ variant: "outline", size: "sm" })} aria-label="Edit" title="Edit">
          <Pencil />
          <span className="hidden sm:inline">Edit</span>
        </Link>
      </div>
      <div className="flex flex-col gap-6 md:flex-row">
        {book.coverUrl && (
          <img src={book.coverUrl} alt={`Cover of ${book.title}`} className="aspect-[2/3] w-full max-w-[200px] rounded-md object-cover shadow-sm" />
        )}
        <dl className="grid max-w-[65ch] content-start gap-3 text-sm">
          <div>
            <dt className="text-muted-foreground">Authors</dt>
            <dd className="flex flex-wrap gap-x-3">
              {book.authors.map((a) => (
                <Link key={a._id} href={`/admin/authors/${a._id}`} className="text-primary underline-offset-4 hover:underline">{a.name}</Link>
              ))}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Genres</dt>
            <dd className="flex flex-wrap gap-2">
              {book.genres.length === 0 && "None"}
              {book.genres.map((g) => (
                <Badge key={g._id} variant="secondary" render={<Link href={`/admin/genres/${g._id}`} />}>{g.name}</Badge>
              ))}
            </dd>
          </div>
          <div><dt className="text-muted-foreground">Published</dt><dd>{book.publishedYear || "—"}</dd></div>
          <div><dt className="text-muted-foreground">ISBN</dt><dd className="font-mono">{book.isbn || "—"}</dd></div>
          <div>
            <dt className="text-muted-foreground">Description</dt>
            <dd className="whitespace-pre-line">{book.description || "—"}</dd>
          </div>
          <div><dt className="text-muted-foreground">Created / updated</dt><dd>{fmt(book.createdAt)} / {fmt(book.updatedAt)}</dd></div>
        </dl>
      </div>
    </section>
  );
}
