import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function BookTable({ books, empty }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Authors</TableHead>
          <TableHead>Genres</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {books.map((b) => (
          <TableRow key={b._id}>
            <TableCell>
              <Link href={`/admin/books/${b._id}`} className="text-primary underline-offset-4 hover:underline">{b.title}</Link>
            </TableCell>
            <TableCell>{b.authors.map((a) => a.name).join(", ")}</TableCell>
            <TableCell>{b.genres.map((g) => g.name).join(", ")}</TableCell>
          </TableRow>
        ))}
        {books.length === 0 && (
          <TableRow>
            <TableCell colSpan={3} className="text-muted-foreground">{empty}</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
