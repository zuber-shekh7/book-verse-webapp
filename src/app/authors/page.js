import Link from "next/link";
import { Suspense } from "react";
import { BrowseList } from "@/components/browse-list";
import { SiteHeader } from "@/components/site-header";
import { listPublicAuthors } from "@/lib/catalog";

export const metadata = { title: "Authors | BookVerse" };

export default function AuthorsPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-[1200px] px-4 py-8 md:px-6">
        <Link href="/" className="text-sm text-muted-foreground">&larr; All books</Link>
        <h1 className="mt-4 mb-6 font-heading text-4xl font-semibold">Authors</h1>
        <Suspense fallback={<p className="text-muted-foreground">Loading...</p>}>
          <Authors />
        </Suspense>
      </main>
    </>
  );
}

async function Authors() {
  const authors = await listPublicAuthors();
  return <BrowseList items={authors} basePath="/authors" empty="No authors yet." />;
}
