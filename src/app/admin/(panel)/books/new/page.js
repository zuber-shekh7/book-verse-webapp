import { AdminBreadcrumbs } from "@/components/admin/breadcrumbs";
import { saveBook } from "@/actions/catalog";
import { BookForm } from "@/components/admin/forms";
import { listAuthors, listGenres } from "@/lib/catalog";
import { requireAdmin } from "@/lib/dal";

// Query params can repeat; take the first value.
const first = (v) => (Array.isArray(v) ? v[0] : v) ?? "";

// Pre-select a record only when exactly one name matches (case-insensitive).
function matchOne(list, name) {
  const wanted = name.trim().toLowerCase();
  if (!wanted) return [];
  const hits = list.filter((x) => x.name.trim().toLowerCase() === wanted);
  return hits.length === 1 ? [{ _id: hits[0]._id }] : [];
}

// ?title=&author=&genre= come from a book request ("Add this book").
export default async function NewBookPage({ searchParams }) {
  await requireAdmin();
  const sp = await searchParams;
  const [authors, genres] = await Promise.all([listAuthors(), listGenres()]);
  const prefill = {
    title: first(sp.title).slice(0, 200),
    authors: matchOne(authors, first(sp.author)),
    genres: matchOne(genres, first(sp.genre)),
  };
  return (
    <section>
      <AdminBreadcrumbs items={[{ label: "Books", href: "/admin/books" }, { label: "New book" }]} />
      <h1 className="mb-4 text-2xl font-bold">New book</h1>
      <BookForm action={saveBook.bind(null, null)} book={prefill} authors={authors} genres={genres} />
    </section>
  );
}
