import { AdminBreadcrumbs } from "@/components/admin/breadcrumbs";
import { notFound } from "next/navigation";
import { saveAuthor } from "@/actions/catalog";
import { AuthorForm } from "@/components/admin/forms";
import { getAuthor } from "@/lib/catalog";
import { requireAdmin } from "@/lib/dal";

export default async function EditAuthorPage({ params }) {
  await requireAdmin();
  const { id } = await params;
  const author = await getAuthor(id);
  if (!author) notFound();
  return (
    <section>
      <AdminBreadcrumbs items={[{ label: "Authors", href: "/admin/authors" }, { label: author.name }, { label: "Edit" }]} />
      <h1 className="mb-4 text-2xl font-bold">Edit author</h1>
      <AuthorForm action={saveAuthor.bind(null, id)} author={author} />
    </section>
  );
}
