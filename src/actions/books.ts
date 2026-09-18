"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { BookStatus } from "@/generated/prisma";
import { resolveOwnerId } from "@/lib/media";
import { prisma } from "@/lib/prisma";

export type MediaFormState = {
  error?: string;
};

function parseBookPayload(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const author = String(formData.get("author") ?? "").trim();
  const genre = String(formData.get("genre") ?? "").trim() || null;
  const notes = String(formData.get("notes") ?? "").trim() || null;
  const coverUrl = String(formData.get("coverUrl") ?? "").trim() || null;
  const yearRaw = String(formData.get("year") ?? "").trim();
  const ratingRaw = String(formData.get("rating") ?? "").trim();
  const status = String(formData.get("status") ?? "WANT_TO_READ") as BookStatus;

  if (!title || !author) {
    return { error: "Title and author are required." } as const;
  }

  if (!Object.values(BookStatus).includes(status)) {
    return { error: "Choose a valid reading status." } as const;
  }

  return {
    data: {
      title,
      author,
      genre,
      notes,
      coverUrl,
      year: yearRaw ? Number(yearRaw) : null,
      rating: ratingRaw ? Number(ratingRaw) : null,
      status,
    },
  } as const;
}

export async function createBook(_prev: MediaFormState, formData: FormData): Promise<MediaFormState> {
  const parsed = parseBookPayload(formData);
  if ("error" in parsed) return { error: parsed.error };

  try {
    await prisma.book.create({
      data: {
        ...parsed.data,
        userId: await resolveOwnerId(),
      },
    });
  } catch {
    return { error: "Could not save this book. Check your database connection." };
  }

  revalidatePath("/");
  revalidatePath("/books");
  redirect("/books");
}

export async function updateBook(id: string, _prev: MediaFormState, formData: FormData): Promise<MediaFormState> {
  const parsed = parseBookPayload(formData);
  if ("error" in parsed) return { error: parsed.error };

  try {
    await prisma.book.update({ where: { id }, data: parsed.data });
  } catch {
    return { error: "Could not update this book." };
  }

  revalidatePath("/");
  revalidatePath("/books");
  redirect("/books");
}

export async function deleteBook(id: string, nextPath = "/books") {
  await prisma.book.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/books");
  redirect(nextPath);
}
