"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { MovieStatus } from "@/generated/prisma";
import { resolveOwnerId } from "@/lib/media";
import { prisma } from "@/lib/prisma";
import type { MediaFormState } from "@/actions/books";

function parseMoviePayload(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const director = String(formData.get("director") ?? "").trim();
  const genre = String(formData.get("genre") ?? "").trim() || null;
  const notes = String(formData.get("notes") ?? "").trim() || null;
  const posterUrl = String(formData.get("posterUrl") ?? "").trim() || null;
  const yearRaw = String(formData.get("year") ?? "").trim();
  const ratingRaw = String(formData.get("rating") ?? "").trim();
  const status = String(formData.get("status") ?? "WATCHLIST") as MovieStatus;

  if (!title || !director) {
    return { error: "Title and director are required." } as const;
  }

  if (!Object.values(MovieStatus).includes(status)) {
    return { error: "Choose a valid watch status." } as const;
  }

  return {
    data: {
      title,
      director,
      genre,
      notes,
      posterUrl,
      year: yearRaw ? Number(yearRaw) : null,
      rating: ratingRaw ? Number(ratingRaw) : null,
      status,
    },
  } as const;
}

export async function createMovie(_prev: MediaFormState, formData: FormData): Promise<MediaFormState> {
  const parsed = parseMoviePayload(formData);
  if ("error" in parsed) return { error: parsed.error };

  try {
    await prisma.movie.create({
      data: {
        ...parsed.data,
        userId: await resolveOwnerId(),
      },
    });
  } catch {
    return { error: "Could not save this movie. Check your database connection." };
  }

  revalidatePath("/");
  revalidatePath("/movies");
  redirect("/movies");
}

export async function updateMovie(id: string, _prev: MediaFormState, formData: FormData): Promise<MediaFormState> {
  const parsed = parseMoviePayload(formData);
  if ("error" in parsed) return { error: parsed.error };

  try {
    await prisma.movie.update({ where: { id }, data: parsed.data });
  } catch {
    return { error: "Could not update this movie." };
  }

  revalidatePath("/");
  revalidatePath("/movies");
  redirect("/movies");
}

export async function deleteMovie(id: string, nextPath = "/movies") {
  await prisma.movie.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/movies");
  redirect(nextPath);
}
