import Link from "next/link";
import { Plus } from "lucide-react";
import { BookCatalog } from "@/components/book-catalog";
import { DatabaseEmptyState } from "@/components/database-empty-state";
import { PageHeader } from "@/components/page-header";
import { isDatabaseReachable, prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function BooksPage() {
  const connected = await isDatabaseReachable();

  return (
    <div>
      <PageHeader
        title="Books"
        description="Track what you want to read, what you’re in the middle of, and what you’ve finished."
        action={
          <Link href="/books/new" className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-4 py-2 text-sm text-white dark:bg-white dark:text-zinc-950">
            <Plus className="h-4 w-4" /> Add book
          </Link>
        }
      />
      {!connected ? (
        <DatabaseEmptyState />
      ) : (
        <BookCatalog books={await prisma.book.findMany({ orderBy: { updatedAt: "desc" } })} />
      )}
    </div>
  );
}
