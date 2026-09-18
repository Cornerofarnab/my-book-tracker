import { BookStatus, MovieStatus, type Prisma } from "@/generated/prisma";
import { HttpError, optionalInt, optionalString, requiredString } from "@/lib/http";
import { prisma } from "@/lib/prisma";

const CURRENT_YEAR = new Date().getFullYear();

export async function resolveOwnerId(userId?: string | null) {
  if (userId) {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
    if (!user) {
      throw new HttpError(400, "userId does not match an existing user.");
    }
    return user.id;
  }

  const existing = await prisma.user.findFirst({
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });
  if (existing) return existing.id;

  const created = await prisma.user.create({
    data: {
      email: "demo@library.local",
      name: "Demo Reader",
    },
    select: { id: true },
  });
  return created.id;
}

export function parseBookCreate(body: Record<string, unknown>): Omit<Prisma.BookUncheckedCreateInput, "userId"> {
  return {
    title: requiredString(body.title, "title"),
    author: requiredString(body.author, "author"),
    genre: body.genre === undefined ? undefined : optionalString(body.genre),
    notes: body.notes === undefined ? undefined : optionalString(body.notes),
    coverUrl: body.coverUrl === undefined ? undefined : optionalString(body.coverUrl),
    year: body.year === undefined ? undefined : optionalInt(body.year, "year", 1000, CURRENT_YEAR + 5),
    rating: body.rating === undefined ? undefined : optionalInt(body.rating, "rating", 1, 5),
    status: body.status === undefined ? undefined : parseBookStatus(body.status),
  };
}

export function parseBookUpdate(body: Record<string, unknown>, partial: boolean): Prisma.BookUncheckedUpdateInput {
  const data: Prisma.BookUncheckedUpdateInput = {};

  if (!partial || body.title !== undefined) data.title = requiredString(body.title, "title");
  if (!partial || body.author !== undefined) data.author = requiredString(body.author, "author");
  if (body.genre !== undefined) data.genre = optionalString(body.genre);
  if (body.notes !== undefined) data.notes = optionalString(body.notes);
  if (body.coverUrl !== undefined) data.coverUrl = optionalString(body.coverUrl);
  if (body.year !== undefined) data.year = optionalInt(body.year, "year", 1000, CURRENT_YEAR + 5);
  if (body.rating !== undefined) data.rating = optionalInt(body.rating, "rating", 1, 5);
  if (!partial || body.status !== undefined) data.status = parseBookStatus(body.status ?? "WANT_TO_READ");

  return data;
}

export function parseMovieCreate(body: Record<string, unknown>): Omit<Prisma.MovieUncheckedCreateInput, "userId"> {
  return {
    title: requiredString(body.title, "title"),
    director: requiredString(body.director, "director"),
    genre: body.genre === undefined ? undefined : optionalString(body.genre),
    notes: body.notes === undefined ? undefined : optionalString(body.notes),
    posterUrl: body.posterUrl === undefined ? undefined : optionalString(body.posterUrl),
    year: body.year === undefined ? undefined : optionalInt(body.year, "year", 1000, CURRENT_YEAR + 5),
    rating: body.rating === undefined ? undefined : optionalInt(body.rating, "rating", 1, 5),
    status: body.status === undefined ? undefined : parseMovieStatus(body.status),
  };
}

export function parseMovieUpdate(body: Record<string, unknown>, partial: boolean): Prisma.MovieUncheckedUpdateInput {
  const data: Prisma.MovieUncheckedUpdateInput = {};

  if (!partial || body.title !== undefined) data.title = requiredString(body.title, "title");
  if (!partial || body.director !== undefined) data.director = requiredString(body.director, "director");
  if (body.genre !== undefined) data.genre = optionalString(body.genre);
  if (body.notes !== undefined) data.notes = optionalString(body.notes);
  if (body.posterUrl !== undefined) data.posterUrl = optionalString(body.posterUrl);
  if (body.year !== undefined) data.year = optionalInt(body.year, "year", 1000, CURRENT_YEAR + 5);
  if (body.rating !== undefined) data.rating = optionalInt(body.rating, "rating", 1, 5);
  if (!partial || body.status !== undefined) data.status = parseMovieStatus(body.status ?? "WATCHLIST");

  return data;
}

function parseBookStatus(value: unknown): BookStatus {
  if (typeof value !== "string" || !Object.values(BookStatus).includes(value as BookStatus)) {
    throw new HttpError(400, "Choose a valid reading status.");
  }
  return value as BookStatus;
}

function parseMovieStatus(value: unknown): MovieStatus {
  if (typeof value !== "string" || !Object.values(MovieStatus).includes(value as MovieStatus)) {
    throw new HttpError(400, "Choose a valid watch status.");
  }
  return value as MovieStatus;
}

export function parseBookStatusFilter(value: string | null) {
  if (!value) return undefined;
  return parseBookStatus(value);
}

export function parseMovieStatusFilter(value: string | null) {
  if (!value) return undefined;
  return parseMovieStatus(value);
}
