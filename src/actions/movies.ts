"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { resolveOwnerId, parseMoviePayload } from "@/lib/media";
import { prisma } from "@/lib/prisma";
import type { MediaFormState } from "@/actions/books";

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
