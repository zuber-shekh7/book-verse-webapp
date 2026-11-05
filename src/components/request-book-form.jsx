"use client";

import Link from "next/link";
import { useState } from "react";
import { searchCatalogAuthors, searchCatalogGenres, searchCatalogTitles } from "@/actions/book-requests";
import { Field, FormShell } from "@/components/form-shell";
import { SearchPicker } from "@/components/search-picker";

export function RequestBookForm({ action, defaultTitle = "" }) {
  const [existing, setExisting] = useState(null); // catalog book the reader picked as the title
  const [resetKey, setResetKey] = useState(0);

  // The pickers hold their own text, so clear them after a successful request.
  async function submit(prev, formData) {
    const result = await action(prev, formData);
    if (result?.success) {
      setExisting(null);
      setResetKey((k) => k + 1);
    }
    return result;
  }

  return (
    <FormShell action={submit} submitLabel="Send request" pendingLabel="Sending..." submitDisabled={Boolean(existing)}>
      <Field label="Book title" name="title">
        <SearchPicker
          key={`title-${resetKey}`}
          name="title"
          search={searchCatalogTitles}
          defaultValue={resetKey ? "" : defaultTitle}
          onPick={setExisting}
          placeholder="Search for a title"
        />
        {existing && (
          <p className="text-sm text-muted-foreground">
            &ldquo;{existing.label}&rdquo; is already on BookVerse.{" "}
            <Link href={existing.href} className="text-primary underline-offset-4 hover:underline">View book</Link>
          </p>
        )}
      </Field>
      <Field label="Author" name="author">
        <SearchPicker key={`author-${resetKey}`} name="author" search={searchCatalogAuthors} placeholder="Search for an author" />
      </Field>
      <Field label="Genre" name="genre">
        <SearchPicker key={`genre-${resetKey}`} name="genre" search={searchCatalogGenres} placeholder="Search for a genre" />
      </Field>
    </FormShell>
  );
}
