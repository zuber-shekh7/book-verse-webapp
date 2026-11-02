import Link from "next/link";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Plain GET form: the search term lives in the URL (/?q=), no client JS needed.
export function BookFilters({ q }) {
  return (
    <form action="/" className="mb-8 flex gap-2">
      <div className="relative flex-1">
        <Input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search title or author"
          aria-label="Search"
          className="pr-8 [&::-webkit-search-cancel-button]:hidden"
        />
        {q && (
          <Link
            href="/"
            aria-label="Clear search"
            title="Clear search"
            className="absolute inset-y-0 right-0 flex w-8 items-center justify-center text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </Link>
        )}
      </div>
      <Button type="submit" aria-label="Search">
        <Search />
        <span className="hidden sm:inline">Search</span>
      </Button>
    </form>
  );
}
