"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { resolveOwnerId, parseBookPayload } from "@/lib/media";
import { prisma } from "@/lib/prisma";

export type MediaFormState = {
  error?: string;
};

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
