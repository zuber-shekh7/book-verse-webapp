import Link from "next/link";
import { Pencil } from "lucide-react";
import { notFound } from "next/navigation";
import { AdminBreadcrumbs } from "@/components/admin/breadcrumbs";
import { BookTable } from "@/components/admin/book-table";
import { buttonVariants } from "@/components/ui/button";
import { getAuthor, listBooksByAuthor } from "@/lib/catalog";
import { requireAdmin } from "@/lib/dal";

export default async function AuthorPage({ params }) {
  await requireAdmin();
  const { id } = await params;
  const [author, books] = await Promise.all([getAuthor(id), listBooksByAuthor(id)]);
  if (!author) notFound();
  return (
    <section>
      <AdminBreadcrumbs items={[{ label: "Authors", href: "/admin/authors" }, { label: author.name }]} />
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{author.name}</h1>
        <Link href={`/admin/authors/${id}/edit`} className={buttonVariants({ variant: "outline", size: "sm" })} aria-label="Edit" title="Edit">
          <Pencil />
          <span className="hidden sm:inline">Edit</span>
        </Link>
      </div>
      <p className="mb-6 max-w-[65ch] whitespace-pre-line text-muted-foreground">
        {author.bio || "No bio yet."}
      </p>
      <h2 className="mb-2 text-lg font-semibold">Books ({books.length})</h2>
      <BookTable books={books} empty="No books by this author yet." />
    </section>
  );
}
