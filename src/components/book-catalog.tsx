"use client";

import { BookCard } from "@/components/media-card";
import { CatalogToolbar } from "@/components/catalog-toolbar";
import { BOOK_STATUSES } from "@/lib/utils";
import type { Book } from "@/generated/prisma";

export function BookCatalog({ books }: { books: Book[] }) {
  return (
    <CatalogToolbar items={books} statuses={[...BOOK_STATUSES]}>
      {(filtered) => (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((book) => (
            <BookCard
              key={book.id}
              id={book.id}
              href={`/books/${book.id}/edit`}
              title={book.title}
              subtitle={book.author}
              year={book.year}
              genre={book.genre}
              notes={book.notes}
              rating={book.rating}
              imageUrl={book.coverUrl}
              status={book.status}
            />
          ))}
        </div>
      )}
    </CatalogToolbar>
  );
}
