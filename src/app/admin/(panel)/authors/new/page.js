import { saveAuthor } from "@/actions/catalog";
import { AuthorForm } from "@/components/admin/forms";
import { requireAdmin } from "@/lib/dal";

export default async function NewAuthorPage() {
  await requireAdmin();
  return (
    <section>
      <h1 className="mb-4 text-2xl font-bold">New author</h1>
      <AuthorForm action={saveAuthor.bind(null, null)} />
    </section>
  );
}
