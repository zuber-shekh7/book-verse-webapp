import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  return (
    <header className="border-b">
      <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" className="font-heading text-xl font-semibold">
          BookVerse
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
