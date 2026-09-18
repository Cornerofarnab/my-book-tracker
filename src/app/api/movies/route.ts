import { revalidatePath } from "next/cache";
import { handleApiError, jsonOk, optionalString, readJsonBody } from "@/lib/http";
import { parseMovieCreate, parseMovieStatusFilter, resolveOwnerId } from "@/lib/media";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim() || undefined;
    const genre = searchParams.get("genre")?.trim() || undefined;
    const userId = searchParams.get("userId")?.trim() || undefined;
    const status = parseMovieStatusFilter(searchParams.get("status"));

    const movies = await prisma.movie.findMany({
      where: {
        ...(userId ? { userId } : {}),
        ...(status ? { status } : {}),
        ...(genre ? { genre: { equals: genre, mode: "insensitive" } } : {}),
        ...(q
          ? {
              OR: [
                { title: { contains: q, mode: "insensitive" } },
                { director: { contains: q, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: { updatedAt: "desc" },
    });

    return jsonOk({ movies });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await readJsonBody(request);
    const data = parseMovieCreate(body);
    const userId = await resolveOwnerId(optionalString(body.userId));

    const movie = await prisma.movie.create({
      data: {
        ...data,
        userId,
      },
    });

    revalidatePath("/");
    revalidatePath("/movies");
    return jsonOk({ movie }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
