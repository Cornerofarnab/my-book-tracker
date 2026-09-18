import Link from "next/link";
import { DeleteButton } from "@/components/delete-button";
import { RatingStars } from "@/components/rating-stars";
import { BookStatusBadge, MovieStatusBadge } from "@/components/status-badge";

type CardProps = {
  id: string;
  href: string;
  title: string;
  subtitle: string;
  year?: number | null;
  genre?: string | null;
  notes?: string | null;
  rating?: number | null;
  imageUrl?: string | null;
};

export function BookCard(props: CardProps & { status: string }) {
  return (
    <MediaCard
      {...props}
      kind="book"
      badge={<BookStatusBadge status={props.status} />}
      fallback="Book"
    />
  );
}

export function MovieCard(props: CardProps & { status: string }) {
  return (
    <MediaCard
      {...props}
      kind="movie"
      badge={<MovieStatusBadge status={props.status} />}
      fallback="Film"
    />
  );
}

function MediaCard({
  id,
  kind,
  href,
  title,
  subtitle,
  year,
  genre,
  notes,
  rating,
  imageUrl,
  badge,
  fallback,
}: CardProps & { kind: "book" | "movie"; badge: React.ReactNode; fallback: string }) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-white/10 dark:bg-white/5">
      <Link href={href} className="block">
        <div className="relative h-40 overflow-hidden bg-gradient-to-br from-zinc-200 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          ) : (
            <div className="flex h-full items-end p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{fallback}</p>
            </div>
          )}
        </div>
        <div className="space-y-3 p-5 pb-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold leading-tight text-zinc-950 dark:text-white">{title}</h3>
              <p className="mt-1 text-sm text-zinc-500">
                {subtitle}
                {year ? ` · ${year}` : ""}
              </p>
            </div>
            {badge}
          </div>
          <div className="flex items-center justify-between">
            <RatingStars value={rating} />
            {genre ? <span className="text-xs text-zinc-500">{genre}</span> : null}
          </div>
          {notes ? <p className="line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">{notes}</p> : null}
        </div>
      </Link>
      <div className="flex items-center justify-end p-4 pt-3">
        <DeleteButton id={id} kind={kind} compact />
      </div>
    </article>
  );
}
