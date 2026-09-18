import Link from "next/link";
import { Plus } from "lucide-react";
import { DatabaseEmptyState } from "@/components/database-empty-state";
import { MovieCatalog } from "@/components/movie-catalog";
import { PageHeader } from "@/components/page-header";
import { isDatabaseReachable, prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function MoviesPage() {
  const connected = await isDatabaseReachable();

  return (
    <div>
      <PageHeader
        title="Movies"
        description="Keep a watchlist, mark what you’re watching, and rate what you’ve seen."
        action={
          <Link href="/movies/new" className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-4 py-2 text-sm text-white dark:bg-white dark:text-zinc-950">
            <Plus className="h-4 w-4" /> Add movie
          </Link>
        }
      />
      {!connected ? (
        <DatabaseEmptyState />
      ) : (
        <MovieCatalog movies={await prisma.movie.findMany({ orderBy: { updatedAt: "desc" } })} />
      )}
    </div>
  );
}
