import { Suspense } from "react";
import { login } from "@/actions/auth";
import { AuthRedirect } from "@/components/auth-redirect";
import { ReaderLoginForm } from "@/components/auth-forms";
import { SiteHeader } from "@/components/site-header";

export const metadata = { title: "Admin login | BookVerse" };

export default function LoginPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-sm px-4 py-16">
        <Suspense fallback={null}>
          <AuthRedirect />
        </Suspense>
        <h1 className="mb-6 font-heading text-3xl font-semibold">Admin login</h1>
        <ReaderLoginForm action={login} />
      </main>
    </>
  );
}
