import Link from "next/link";
import { BookFilters } from "@/components/book-filters";
import { SiteHeader } from "@/components/site-header";

export const metadata = { title: "Page not found | BookVerse" };

const link = "text-primary underline-offset-4 hover:underline";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-xl px-4 py-16 md:py-24">
        <div className="motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2">
          {/* drop-shadow follows the torn edge; box-shadow would not */}
          <div className="relative -rotate-1 drop-shadow-md">
            <Bookmark />
            <div className="rounded-t-lg bg-card px-8 pt-10 pb-6 text-card-foreground">
              <p aria-hidden className="mb-2 text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
                Chapter 404
              </p>
              <h1 className="font-heading">
                <span className="block text-8xl leading-none font-semibold text-primary">404</span>
                <span className="mt-3 block text-3xl font-semibold">This chapter is missing.</span>
              </h1>
              <p className="mt-4 max-w-[45ch] text-muted-foreground">
                The page you wanted was torn out, or maybe it was never written. Try a search, or pick up another story.
              </p>
            </div>
            <TornEdge />
          </div>
        </div>
        <div className="mt-12">
          <BookFilters q="" />
          <p className="text-sm text-muted-foreground">
            Browse: <Link href="/authors" className={link}>Authors</Link>
            {" · "}
            <Link href="/genres" className={link}>Genres</Link>
            {" · "}
            <Link href="/" className={link}>Home</Link>
          </p>
        </div>
      </main>
    </>
  );
}

// Burgundy ribbon hanging over the top right corner of the page.
function Bookmark() {
  return (
    <span
      aria-hidden
      className="absolute -top-3 right-8 h-16 w-8 bg-primary [clip-path:polygon(0_0,100%_0,100%_100%,50%_80%,0_100%)]"
    />
  );
}

// Jagged strip under the card so the bottom edge looks torn, in both themes.
function TornEdge() {
  const teeth = 24;
  const points = Array.from({ length: teeth * 2 + 1 }, (_, i) => `${(i / (teeth * 2)) * 100},${i % 2 ? 0 : 10}`);
  return (
    <svg aria-hidden viewBox="0 0 100 10" preserveAspectRatio="none" className="block h-3 w-full fill-card">
      <polygon points={`0,0 ${points.join(" ")} 100,0`} />
    </svg>
  );
}
