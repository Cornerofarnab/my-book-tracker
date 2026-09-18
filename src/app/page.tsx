import Link from "next/link";
import { BookOpen, Clapperboard, Plus } from "lucide-react";
import { CompletionStats } from "@/components/completion-stats";
import { DatabaseEmptyState } from "@/components/database-empty-state";
import { BookCard, MovieCard } from "@/components/media-card";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { isDatabaseReachable, prisma } from "@/lib/prisma";
import { averageRating, percent } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const connected = await isDatabaseReachable();

  if (!connected) {
    return (
      <div>
        <PageHeader title="Dashboard" description="Your reading and watching at a glance." />
        <DatabaseEmptyState />
      </div>
    );
  }

  const [books, movies] = await Promise.all([
    prisma.book.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.movie.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  const wantToRead = books.filter((book) => book.status === "WANT_TO_READ").length;
  const reading = books.filter((book) => book.status === "READING").length;
  const finished = books.filter((book) => book.status === "FINISHED").length;
  const watchlist = movies.filter((movie) => movie.status === "WATCHLIST").length;
  const watching = movies.filter((movie) => movie.status === "WATCHING").length;
  const watched = movies.filter((movie) => movie.status === "WATCHED").length;
  const catalogTotal = books.length + movies.length;
  const completedTotal = finished + watched;

  const recentItems = [
    ...books.map((book) => ({ kind: "book" as const, createdAt: book.createdAt, book })),
    ...movies.map((movie) => ({ kind: "movie" as const, createdAt: movie.createdAt, movie })),
  ]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 6);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="A calm overview of what you’re reading and watching."
        action={
          <div className="flex gap-2">
            <Link href="/books/new" className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-4 py-2 text-sm text-white dark:bg-white dark:text-zinc-950">
              <Plus className="h-4 w-4" /> Book
            </Link>
            <Link href="/movies/new" className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-4 py-2 text-sm dark:border-white/10">
              <Plus className="h-4 w-4" /> Movie
            </Link>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Books read"
          value={finished}
          hint={`${books.length} in your shelf · ${percent(finished, books.length)}% finished`}
          accent="text-amber-600 dark:text-amber-300"
        />
        <StatCard
          label="Movies watched"
          value={watched}
          hint={`${movies.length} in your collection · ${percent(watched, movies.length)}% watched`}
          accent="text-rose-600 dark:text-rose-300"
        />
        <StatCard
          label="In progress"
          value={reading + watching}
          hint={`${reading} reading · ${watching} watching`}
        />
        <StatCard
          label="Catalog completion"
          value={`${percent(completedTotal, catalogTotal)}%`}
          hint={`${completedTotal} of ${catalogTotal} titles finished`}
        />
      </div>

      <section className="mt-10 grid gap-4 lg:grid-cols-2">
        <CompletionStats
          title="Book completion"
          completedLabel="books finished"
          completed={finished}
          total={books.length}
          rows={[
            { label: "Want to read", count: wantToRead, barClass: "bg-sky-500" },
            { label: "Reading", count: reading, barClass: "bg-amber-500" },
            { label: "Finished", count: finished, barClass: "bg-emerald-500" },
          ]}
        />
        <CompletionStats
          title="Movie completion"
          completedLabel="movies watched"
          completed={watched}
          total={movies.length}
          rows={[
            { label: "Watchlist", count: watchlist, barClass: "bg-violet-500" },
            { label: "Watching", count: watching, barClass: "bg-rose-500" },
            { label: "Watched", count: watched, barClass: "bg-emerald-500" },
          ]}
        />
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recently added</h2>
          <p className="text-sm text-zinc-500">
            Avg {averageRating([...books, ...movies].map((item) => item.rating)) || "—"}★ across rated titles
          </p>
        </div>
        {recentItems.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-zinc-300 p-8 text-sm text-zinc-500 dark:border-white/15">
            Nothing here yet. Add a book or a movie to see it on the dashboard.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {recentItems.map((item) =>
              item.kind === "book" ? (
                <BookCard
                  key={item.book.id}
                  id={item.book.id}
                  href={`/books/${item.book.id}/edit`}
                  title={item.book.title}
                  subtitle={item.book.author}
                  year={item.book.year}
                  genre={item.book.genre}
                  notes={item.book.notes}
                  rating={item.book.rating}
                  imageUrl={item.book.coverUrl}
                  status={item.book.status}
                />
              ) : (
                <MovieCard
                  key={item.movie.id}
                  id={item.movie.id}
                  href={`/movies/${item.movie.id}/edit`}
                  title={item.movie.title}
                  subtitle={item.movie.director}
                  year={item.movie.year}
                  genre={item.movie.genre}
                  notes={item.movie.notes}
                  rating={item.movie.rating}
                  imageUrl={item.movie.posterUrl}
                  status={item.movie.status}
                />
              ),
            )}
          </div>
        )}
        <div className="mt-4 flex gap-4 text-sm text-zinc-500">
          <Link href="/books" className="inline-flex items-center gap-2 hover:text-zinc-950 dark:hover:text-white">
            <BookOpen className="h-4 w-4" /> View all books
          </Link>
          <Link href="/movies" className="inline-flex items-center gap-2 hover:text-zinc-950 dark:hover:text-white">
            <Clapperboard className="h-4 w-4" /> View all movies
          </Link>
        </div>
      </section>
    </div>
  );
}
