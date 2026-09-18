import { formatBookStatus, formatMovieStatus } from "@/lib/utils";
import { cn } from "@/lib/utils";

const bookStyles: Record<string, string> = {
  WANT_TO_READ: "bg-sky-100 text-sky-800 dark:bg-sky-400/15 dark:text-sky-200",
  READING: "bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-200",
  FINISHED: "bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-200",
};

const movieStyles: Record<string, string> = {
  WATCHLIST: "bg-violet-100 text-violet-800 dark:bg-violet-400/15 dark:text-violet-200",
  WATCHING: "bg-rose-100 text-rose-800 dark:bg-rose-400/15 dark:text-rose-200",
  WATCHED: "bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-200",
};

export function BookStatusBadge({ status }: { status: string }) {
  return (
    <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-semibold", bookStyles[status])}>
      {formatBookStatus(status)}
    </span>
  );
}

export function MovieStatusBadge({ status }: { status: string }) {
  return (
    <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-semibold", movieStyles[status])}>
      {formatMovieStatus(status)}
    </span>
  );
}
