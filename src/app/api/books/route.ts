import { revalidatePath } from "next/cache";
import { handleApiError, jsonOk, optionalString, readJsonBody } from "@/lib/http";
import { parseBookCreate, parseBookStatusFilter, resolveOwnerId } from "@/lib/media";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim() || undefined;
    const genre = searchParams.get("genre")?.trim() || undefined;
    const userId = searchParams.get("userId")?.trim() || undefined;
    const status = parseBookStatusFilter(searchParams.get("status"));

    const books = await prisma.book.findMany({
      where: {
        ...(userId ? { userId } : {}),
        ...(status ? { status } : {}),
        ...(genre ? { genre: { equals: genre, mode: "insensitive" } } : {}),
        ...(q
          ? {
              OR: [
                { title: { contains: q, mode: "insensitive" } },
                { author: { contains: q, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: { updatedAt: "desc" },
    });

    return jsonOk({ books });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await readJsonBody(request);
    const data = parseBookCreate(body);
    const userId = await resolveOwnerId(optionalString(body.userId));

    const book = await prisma.book.create({
      data: {
        ...data,
        userId,
      },
    });

    revalidatePath("/");
    revalidatePath("/books");
    return jsonOk({ book }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
