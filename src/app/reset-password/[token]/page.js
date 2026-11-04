import Link from "next/link";
import { Suspense } from "react";
import { resetPassword } from "@/actions/auth";
import { ResetPasswordForm } from "@/components/auth-forms";
import { SiteHeader } from "@/components/site-header";

export const metadata = { title: "Reset password | BookVerse" };

export default function ResetPasswordPage({ params }) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-sm px-4 py-16">
        <h1 className="mb-6 font-heading text-3xl font-semibold">Set a new password</h1>
        <Suspense fallback={<p className="text-muted-foreground">Loading...</p>}>
          <ResetForm params={params} />
        </Suspense>
        <p className="mt-6 text-sm text-muted-foreground">
          <Link href="/login" className="text-primary underline-offset-4 hover:underline">Back to log in</Link>
        </p>
      </main>
    </>
  );
}

// The token is checked when the form is submitted, not when the page renders.
async function ResetForm({ params }) {
  const { token } = await params;
  return <ResetPasswordForm action={resetPassword.bind(null, token)} />;
}
