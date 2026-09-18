import { revalidatePath } from "next/cache";
import { handleApiError, HttpError, jsonOk, readJsonBody } from "@/lib/http";
import { parseMovieUpdate } from "@/lib/media";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

async function getMovieOrThrow(id: string) {
  const movie = await prisma.movie.findUnique({ where: { id } });
  if (!movie) {
    throw new HttpError(404, "Movie not found.");
  }
  return movie;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const movie = await getMovieOrThrow(id);
    return jsonOk({ movie });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    await getMovieOrThrow(id);
    const body = await readJsonBody(request);
    const data = parseMovieUpdate(body, false);
    const movie = await prisma.movie.update({ where: { id }, data });
    revalidatePath("/");
    revalidatePath("/movies");
    return jsonOk({ movie });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    await getMovieOrThrow(id);
    const body = await readJsonBody(request);
    const data = parseMovieUpdate(body, true);
    if (Object.keys(data).length === 0) {
      throw new HttpError(400, "Provide at least one field to update.");
    }
    const movie = await prisma.movie.update({ where: { id }, data });
    revalidatePath("/");
    revalidatePath("/movies");
    return jsonOk({ movie });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    await getMovieOrThrow(id);
    await prisma.movie.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/movies");
    return jsonOk({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
