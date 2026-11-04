import Link from "next/link";
import { Suspense } from "react";
import { LayoutDashboard, LogIn, Shield, UserPlus } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { readSession } from "@/lib/session";

export function SiteHeader() {
  return (
    <header className="border-b">
      <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" className="font-heading text-xl font-semibold">
          BookVerse
        </Link>
        <div className="flex items-center gap-1">
          <Suspense fallback={null}>
            <AuthLinks />
          </Suspense>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

// Labels collapse to icons below sm, like the admin row actions.
function HeaderLink({ href, icon: Icon, label, variant = "ghost" }) {
  return (
    <Link href={href} aria-label={label} title={label} className={buttonVariants({ variant, size: "sm" })}>
      <Icon />
      <span className="hidden sm:inline">{label}</span>
    </Link>
  );
}

async function AuthLinks() {
  const session = await readSession();
  if (session?.role === "reader") return <HeaderLink href="/dashboard" icon={LayoutDashboard} label="Dashboard" />;
  if (session?.role === "admin") return <HeaderLink href="/admin/books" icon={Shield} label="Admin" />;
  return (
    <>
      <HeaderLink href="/login" icon={LogIn} label="Log in" />
      <HeaderLink href="/signup" icon={UserPlus} label="Sign up" variant="default" />
    </>
  );
}
