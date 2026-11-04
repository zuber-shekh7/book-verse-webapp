import Link from "next/link";
import { requestPasswordReset } from "@/actions/auth";
import { ForgotPasswordForm } from "@/components/auth-forms";
import { SiteHeader } from "@/components/site-header";

export const metadata = { title: "Forgot password | BookVerse" };

export default function ForgotPasswordPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-sm px-4 py-16">
        <h1 className="mb-2 font-heading text-3xl font-semibold">Forgot password</h1>
        <p className="mb-6 text-sm text-muted-foreground">Enter your email and we&apos;ll send you a link to reset it.</p>
        <ForgotPasswordForm action={requestPasswordReset} />
        <p className="mt-6 text-sm text-muted-foreground">
          <Link href="/login" className="text-primary underline-offset-4 hover:underline">Back to log in</Link>
        </p>
      </main>
    </>
  );
}
