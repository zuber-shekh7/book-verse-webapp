import Link from "next/link";
import { Suspense } from "react";
import { changePassword, updateProfile } from "@/actions/auth";
import { ChangePasswordForm, ProfileForm } from "@/components/auth-forms";
import { SiteHeader } from "@/components/site-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/dal";

export const metadata = { title: "Settings | BookVerse" };

export default function SettingsPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-[1200px] px-4 py-8 md:px-6">
        <Link href="/dashboard" className="text-sm text-muted-foreground">&larr; Dashboard</Link>
        <h1 className="mt-4 mb-8 font-heading text-3xl font-semibold">Settings</h1>
        <Suspense fallback={<p className="text-muted-foreground">Loading...</p>}>
          <Settings />
        </Suspense>
      </main>
    </>
  );
}

async function Settings() {
  const user = await getCurrentUser();
  return (
    <div className="grid max-w-md gap-6">
      <Card>
        <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
        <CardContent className="grid gap-4">
          <p className="text-sm text-muted-foreground">Signed in as {user.email}</p>
          <ProfileForm action={updateProfile} name={user.name} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Change password</CardTitle></CardHeader>
        <CardContent>
          <ChangePasswordForm action={changePassword} />
        </CardContent>
      </Card>
    </div>
  );
}
