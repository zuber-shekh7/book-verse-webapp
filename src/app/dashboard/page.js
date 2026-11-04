import { Suspense } from "react";
import Link from "next/link";
import { Settings } from "lucide-react";
import { LogoutButton } from "@/components/logout-button";
import { SiteHeader } from "@/components/site-header";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/dal";
import { countByStatus } from "@/lib/reading-list";
import { READING_STATUSES } from "@/lib/reading-status";

export const metadata = { title: "Dashboard | BookVerse" };

export default function DashboardPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-[1200px] px-4 py-8 md:px-6">
        <Suspense fallback={<p className="text-muted-foreground">Loading...</p>}>
          <Dashboard />
        </Suspense>
      </main>
    </>
  );
}

async function Dashboard() {
  const user = await getCurrentUser();
  const counts = await countByStatus(user.id);
  const since = new Date(user.createdAt).toLocaleDateString("en-US", { dateStyle: "long" });
  return (
    <>
      <div className="mb-8 flex items-center justify-between gap-4">
        <h1 className="font-heading text-3xl font-semibold">Welcome, {user.name}</h1>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/settings" className={buttonVariants({ variant: "outline", size: "sm" })} aria-label="Settings" title="Settings">
            <Settings />
            <span className="hidden sm:inline">Settings</span>
          </Link>
          <LogoutButton />
        </div>
      </div>
      <div className="grid max-w-3xl gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Your account</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-3 text-sm">
            <div><dt className="text-muted-foreground">Name</dt><dd>{user.name}</dd></div>
            <div><dt className="text-muted-foreground">Email</dt><dd>{user.email}</dd></div>
            <div><dt className="text-muted-foreground">Member since</dt><dd>{since}</dd></div>
          </dl>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Reading list ({counts.all})</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <ul className="grid gap-2 text-sm">
            {READING_STATUSES.map(({ value, label, icon: Icon }) => (
              <li key={value} className="flex items-center justify-between">
                <Link href={`/dashboard/reading-list?status=${value}`} className="flex items-center gap-2 hover:text-primary">
                  <Icon className="size-4 text-muted-foreground" />
                  {label}
                </Link>
                <span className="text-muted-foreground">{counts[value]}</span>
              </li>
            ))}
          </ul>
          <Link href="/dashboard/reading-list" className={buttonVariants({ variant: "outline", size: "sm" }) + " w-fit"}>
            View reading list
          </Link>
        </CardContent>
      </Card>
      </div>
    </>
  );
}
