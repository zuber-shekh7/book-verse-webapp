import { notFound } from "next/navigation";
import { saveGenre } from "@/actions/catalog";
import { GenreForm } from "@/components/admin/forms";
import { getGenre } from "@/lib/catalog";
import { requireAdmin } from "@/lib/dal";

export default async function EditGenrePage({ params }) {
  await requireAdmin();
  const { id } = await params;
  const genre = await getGenre(id);
  if (!genre) notFound();
  return (
    <section>
      <h1 className="mb-4 text-2xl font-bold">Edit genre</h1>
      <GenreForm action={saveGenre.bind(null, id)} genre={genre} />
    </section>
  );
}
