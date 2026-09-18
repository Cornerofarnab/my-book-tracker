import { revalidatePath } from "next/cache";
import { handleApiError, HttpError, jsonOk, readJsonBody } from "@/lib/http";
import { parseBookUpdate } from "@/lib/media";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

async function getBookOrThrow(id: string) {
  const book = await prisma.book.findUnique({ where: { id } });
  if (!book) {
    throw new HttpError(404, "Book not found.");
  }
  return book;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const book = await getBookOrThrow(id);
    return jsonOk({ book });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    await getBookOrThrow(id);
    const body = await readJsonBody(request);
    const data = parseBookUpdate(body, false);
    const book = await prisma.book.update({ where: { id }, data });
    revalidatePath("/");
    revalidatePath("/books");
    return jsonOk({ book });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    await getBookOrThrow(id);
    const body = await readJsonBody(request);
    const data = parseBookUpdate(body, true);
    if (Object.keys(data).length === 0) {
      throw new HttpError(400, "Provide at least one field to update.");
    }
    const book = await prisma.book.update({ where: { id }, data });
    revalidatePath("/");
    revalidatePath("/books");
    return jsonOk({ book });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    await getBookOrThrow(id);
    await prisma.book.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/books");
    return jsonOk({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
