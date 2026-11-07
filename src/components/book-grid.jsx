import { BookCard } from "@/components/book-card";

export function BookGrid({ books }) {
  return (
    <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {books.map((b) => (
        <li key={b._id}>
          <BookCard book={b} />
        </li>
      ))}
    </ul>
  );
}
