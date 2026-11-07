import Link from "next/link";
import { Suspense } from "react";
import { BrowseList } from "@/components/browse-list";
import { SiteHeader } from "@/components/site-header";
import { listPublicGenres } from "@/lib/catalog";

export const metadata = { title: "Genres | BookVerse" };

export default function GenresPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-[1200px] px-4 py-8 md:px-6">
        <Link href="/" className="text-sm text-muted-foreground">&larr; All books</Link>
        <h1 className="mt-4 mb-6 font-heading text-4xl font-semibold">Genres</h1>
        <Suspense fallback={<p className="text-muted-foreground">Loading...</p>}>
          <Genres />
        </Suspense>
      </main>
    </>
  );
}

async function Genres() {
  const genres = await listPublicGenres();
  return <BrowseList items={genres} basePath="/genres" empty="No genres yet." />;
}
