"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function Field({ label, name, children }) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={name}>{label}</Label>
      {children}
    </div>
  );
}

function FormShell({ action, submitLabel, children }) {
  const [state, formAction, pending] = useActionState(action, null);
  return (
    <form action={formAction} className="grid max-w-xl gap-4">
      {children}
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending} className="w-fit">
        {pending ? "Saving..." : submitLabel}
      </Button>
    </form>
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
    </FormShell>
  );
}

export function GenreForm({ action, genre }) {
  return (
    <FormShell action={action} submitLabel="Save genre">
      <Field label="Name" name="name">
        <Input id="name" name="name" defaultValue={genre?.name} required />
      </Field>
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
              {a.name}
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
              {g.name}
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
    </FormShell>
  );
}

export function LoginForm({ action }) {
  return (
    <FormShell action={action} submitLabel="Log in">
      <Field label="Email" name="email">
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </Field>
      <Field label="Password" name="password">
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </Field>
    </FormShell>
  );
}
