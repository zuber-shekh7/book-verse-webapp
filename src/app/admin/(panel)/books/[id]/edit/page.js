import { notFound } from "next/navigation";
import { saveBook } from "@/actions/catalog";
import { BookForm } from "@/components/admin/forms";
import { getBook, listAuthors, listGenres } from "@/lib/catalog";
import { requireAdmin } from "@/lib/dal";

export default async function EditBookPage({ params }) {
  await requireAdmin();
  const { id } = await params;
  const [book, authors, genres] = await Promise.all([getBook(id), listAuthors(), listGenres()]);
  if (!book) notFound();
  return (
    <section>
      <h1 className="mb-4 text-2xl font-bold">Edit book</h1>
      <BookForm action={saveBook.bind(null, id)} book={book} authors={authors} genres={genres} />
    </section>
  );
}
