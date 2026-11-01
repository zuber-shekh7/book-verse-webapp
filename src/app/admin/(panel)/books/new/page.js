import { AdminBreadcrumbs } from "@/components/admin/breadcrumbs";
import { saveBook } from "@/actions/catalog";
import { BookForm } from "@/components/admin/forms";
import { listAuthors, listGenres } from "@/lib/catalog";
import { requireAdmin } from "@/lib/dal";

export default async function NewBookPage() {
  await requireAdmin();
  const [authors, genres] = await Promise.all([listAuthors(), listGenres()]);
  return (
    <section>
      <AdminBreadcrumbs items={[{ label: "Books", href: "/admin/books" }, { label: "New book" }]} />
      <h1 className="mb-4 text-2xl font-bold">New book</h1>
      <BookForm action={saveBook.bind(null, null)} authors={authors} genres={genres} />
    </section>
  );
}
