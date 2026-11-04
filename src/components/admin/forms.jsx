"use client";

import { Input } from "@/components/ui/input";
import { Field, FormShell } from "@/components/form-shell";
import { Textarea } from "@/components/ui/textarea";

function ActiveField({ isActive }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" name="isActive" defaultChecked={isActive} className="size-4 accent-primary" />
      Active (visible to readers)
    </label>
  );
}

export function AuthorForm({ action, author }) {
  return (
    <FormShell action={action} submitLabel="Save author">
      <Field label="Name" name="name">
        <Input id="name" name="name" defaultValue={author?.name} required />
      </Field>
      <Field label="Bio" name="bio">
        <Textarea id="bio" name="bio" defaultValue={author?.bio} rows={4} />
      </Field>
      <ActiveField isActive={author?.isActive} />
    </FormShell>
  );
}

export function GenreForm({ action, genre }) {
  return (
    <FormShell action={action} submitLabel="Save genre">
      <Field label="Name" name="name">
        <Input id="name" name="name" defaultValue={genre?.name} required />
      </Field>
      <ActiveField isActive={genre?.isActive} />
    </FormShell>
  );
}

const selectClass =
  "min-h-32 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm";

export function BookForm({ action, book, authors, genres }) {
  const selectedAuthors = book?.authors?.map((a) => a._id) ?? [];
  const selectedGenres = book?.genres?.map((g) => g._id) ?? [];
  return (
    <FormShell action={action} submitLabel="Save book">
      <Field label="Title" name="title">
        <Input id="title" name="title" defaultValue={book?.title} required />
      </Field>
      <Field label="Authors (hold Cmd/Ctrl to select several)" name="authors">
        <select
          id="authors"
          name="authors"
          multiple
          required
          defaultValue={selectedAuthors}
          className={selectClass}
        >
          {authors.map((a) => (
            <option key={a._id} value={a._id}>
              {a.name}{a.isActive ? "" : " (inactive)"}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Genres (hold Cmd/Ctrl to select several)" name="genres">
        <select
          id="genres"
          name="genres"
          multiple
          defaultValue={selectedGenres}
          className={selectClass}
        >
          {genres.map((g) => (
            <option key={g._id} value={g._id}>
              {g.name}{g.isActive ? "" : " (inactive)"}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Description" name="description">
        <Textarea id="description" name="description" defaultValue={book?.description} rows={5} />
      </Field>
      <Field label="Cover image URL" name="coverUrl">
        <Input id="coverUrl" name="coverUrl" type="url" defaultValue={book?.coverUrl} />
      </Field>
      <Field label="ISBN" name="isbn">
        <Input id="isbn" name="isbn" defaultValue={book?.isbn} />
      </Field>
      <Field label="Published year" name="publishedYear">
        <Input
          id="publishedYear"
          name="publishedYear"
          type="number"
          defaultValue={book?.publishedYear}
        />
      </Field>
      <ActiveField isActive={book?.isActive} />
    </FormShell>
  );
}
