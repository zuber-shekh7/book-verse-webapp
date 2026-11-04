import Link from "next/link";
import { Suspense } from "react";
import { signup } from "@/actions/auth";
import { AuthRedirect } from "@/components/auth-redirect";
import { SignupForm } from "@/components/auth-forms";
import { SiteHeader } from "@/components/site-header";

export const metadata = { title: "Sign up | BookVerse" };

export default function SignupPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-sm px-4 py-16">
        <Suspense fallback={null}>
          <AuthRedirect />
        </Suspense>
        <h1 className="mb-6 font-heading text-3xl font-semibold">Create your account</h1>
        <SignupForm action={signup} />
        <p className="mt-6 text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary underline-offset-4 hover:underline">Log in</Link>
        </p>
      </main>
    </>
  );
}
