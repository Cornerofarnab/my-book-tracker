"use client";

import { MovieCard } from "@/components/media-card";
import { CatalogToolbar } from "@/components/catalog-toolbar";
import { MOVIE_STATUSES } from "@/lib/utils";
import type { Movie } from "@/generated/prisma";

export function MovieCatalog({ movies }: { movies: Movie[] }) {
  return (
    <CatalogToolbar items={movies} statuses={[...MOVIE_STATUSES]}>
      {(filtered) => (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((movie) => (
            <MovieCard
              key={movie.id}
              id={movie.id}
              href={`/movies/${movie.id}/edit`}
              title={movie.title}
              subtitle={movie.director}
              year={movie.year}
              genre={movie.genre}
              notes={movie.notes}
              rating={movie.rating}
              imageUrl={movie.posterUrl}
              status={movie.status}
            />
          ))}
        </div>
      )}
    </CatalogToolbar>
  );
}
