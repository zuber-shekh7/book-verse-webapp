import { notFound } from "next/navigation";
import { AdminBreadcrumbs } from "@/components/admin/breadcrumbs";
import { StatusBadge } from "@/components/admin/status-badge";
import { UserActiveButton } from "@/components/admin/user-active-button";
import { RoleBadge } from "@/components/admin/role-badge";
import { requireAdmin } from "@/lib/dal";
import { getUser } from "@/lib/users";

const fmt = (d) => new Date(d).toLocaleDateString("en-US", { dateStyle: "long" });

export default async function UserPage({ params }) {
  await requireAdmin();
  const { id } = await params;
  const user = await getUser(id);
  if (!user) notFound();
  const title = user.name || user.email;
  const isActive = user.isActive !== false;
  return (
    <section>
      <AdminBreadcrumbs items={[{ label: "Users", href: "/admin/users" }, { label: title }]} />
      <div className="mb-4 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">{title}</h1>
        {user.role === "reader" && <UserActiveButton id={user._id} isActive={isActive} name={title} />}
      </div>
      <dl className="grid max-w-[65ch] gap-3 text-sm">
        <div><dt className="text-muted-foreground">Name</dt><dd>{user.name || "—"}</dd></div>
        <div><dt className="text-muted-foreground">Email</dt><dd>{user.email}</dd></div>
        <div><dt className="text-muted-foreground">Role</dt><dd><RoleBadge role={user.role} /></dd></div>
        <div><dt className="text-muted-foreground">Status</dt><dd><StatusBadge isActive={isActive} inactiveLabel="Deactivated" /></dd></div>
        <div><dt className="text-muted-foreground">Joined</dt><dd>{fmt(user.createdAt)}</dd></div>
        <div><dt className="text-muted-foreground">Last updated</dt><dd>{fmt(user.updatedAt)}</dd></div>
      </dl>
    </section>
  );
}
