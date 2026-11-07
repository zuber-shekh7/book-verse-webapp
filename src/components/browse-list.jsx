import Link from "next/link";

// Alphabetical name + book count links. items: [{ _id, name, count }]
export function BrowseList({ items, basePath, empty }) {
  if (items.length === 0) return <p className="text-muted-foreground">{empty}</p>;
  return (
    <ul className="grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((i) => (
        <li key={i._id} className="flex items-baseline justify-between gap-3 border-b py-2">
          <Link href={`${basePath}/${i._id}`} className="text-primary underline-offset-4 hover:underline">{i.name}</Link>
          <span className="text-sm text-muted-foreground">{i.count}</span>
        </li>
      ))}
    </ul>
  );
}
