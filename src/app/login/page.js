import Link from "next/link";
import { Suspense } from "react";
import { readerLogin } from "@/actions/auth";
import { AuthRedirect } from "@/components/auth-redirect";
import { ReaderLoginForm } from "@/components/auth-forms";
import { SiteHeader } from "@/components/site-header";

export const metadata = { title: "Log in | BookVerse" };

export default function LoginPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-sm px-4 py-16">
        <Suspense fallback={null}>
          <AuthRedirect />
        </Suspense>
        <h1 className="mb-6 font-heading text-3xl font-semibold">Log in</h1>
        <ReaderLoginForm action={readerLogin} />
        <p className="mt-6 text-sm text-muted-foreground">
          New here?{" "}
          <Link href="/signup" className="text-primary underline-offset-4 hover:underline">Create an account</Link>
        </p>
      </main>
    </>
  );
}
