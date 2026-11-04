import Link from "next/link";
import { Suspense } from "react";
import { readerLogin } from "@/actions/auth";
import { AuthRedirect } from "@/components/auth-redirect";
import { FormMessage } from "@/components/form-message";
import { ReaderLoginForm } from "@/components/auth-forms";
import { SiteHeader } from "@/components/site-header";

export const metadata = { title: "Log in | BookVerse" };

export default function LoginPage({ searchParams }) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-sm px-4 py-16">
        <Suspense fallback={null}>
          <AuthRedirect />
        </Suspense>
        <h1 className="mb-6 font-heading text-3xl font-semibold">Log in</h1>
        <Suspense fallback={null}>
          <ResetNotice searchParams={searchParams} />
        </Suspense>
        <ReaderLoginForm action={readerLogin} />
        <p className="mt-4 text-sm">
          <Link href="/forgot-password" className="text-primary underline-offset-4 hover:underline">Forgot password?</Link>
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          New here?{" "}
          <Link href="/signup" className="text-primary underline-offset-4 hover:underline">Create an account</Link>
        </p>
      </main>
    </>
  );
}

async function ResetNotice({ searchParams }) {
  const { reset } = await searchParams;
  if (!reset) return null;
  return (
    <div className="mb-4">
      <FormMessage type="success">Password updated. Please log in.</FormMessage>
    </div>
  );
}
