import { cookies } from "next/headers";
import { Suspense } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { getAdminEmail } from "@/lib/dal";

export default function PanelLayout({ children }) {
  return (
    <Suspense fallback={null}>
      <Shell>{children}</Shell>
    </Suspense>
  );
}

async function Shell({ children }) {
  const defaultOpen = (await cookies()).get("sidebar_state")?.value !== "false";
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AdminSidebar
        email={
          <Suspense fallback={null}>
            <AdminEmail />
          </Suspense>
        }
      />
      <SidebarInset>
        <header className="flex h-12 items-center border-b px-3">
          <SidebarTrigger />
        </header>
        <div className="mx-auto w-full max-w-5xl p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

async function AdminEmail() {
  const email = await getAdminEmail();
  return <p className="truncate px-2 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">{email}</p>;
}
