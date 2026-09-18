export const BOOK_STATUSES = [
  { value: "WANT_TO_READ", label: "Want to read" },
  { value: "READING", label: "Reading" },
  { value: "FINISHED", label: "Finished" },
] as const;

export const MOVIE_STATUSES = [
  { value: "WATCHLIST", label: "Watchlist" },
  { value: "WATCHING", label: "Watching" },
  { value: "WATCHED", label: "Watched" },
] as const;

export type BookStatusValue = (typeof BOOK_STATUSES)[number]["value"];
export type MovieStatusValue = (typeof MOVIE_STATUSES)[number]["value"];

export function formatBookStatus(status: string) {
  return BOOK_STATUSES.find((item) => item.value === status)?.label ?? status;
}

export function formatMovieStatus(status: string) {
  return MOVIE_STATUSES.find((item) => item.value === status)?.label ?? status;
}

export function averageRating(ratings: Array<number | null | undefined>) {
  const values = ratings.filter((rating): rating is number => typeof rating === "number");
  if (values.length === 0) return 0;
  return Math.round((values.reduce((sum, rating) => sum + rating, 0) / values.length) * 10) / 10;
}

export function percent(part: number, total: number) {
  if (total === 0) return 0;
  return Math.round((part / total) * 100);
}

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
