import { Suspense } from "react";
import Link from "next/link";
import { Settings } from "lucide-react";
import { LogoutButton } from "@/components/logout-button";
import { SiteHeader } from "@/components/site-header";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/dal";

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
      <Card className="max-w-md">
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
    </>
  );
}
