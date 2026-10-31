import { saveGenre } from "@/actions/catalog";
import { GenreForm } from "@/components/admin/forms";
import { requireAdmin } from "@/lib/dal";

export default async function NewGenrePage() {
  await requireAdmin();
  return (
    <section>
      <h1 className="mb-4 text-2xl font-bold">New genre</h1>
      <GenreForm action={saveGenre.bind(null, null)} />
    </section>
  );
}
