import { notFound } from "next/navigation";
import { DeleteButton } from "@/components/delete-button";
import { MovieForm } from "@/components/movie-form";
import { PageHeader } from "@/components/page-header";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function EditMoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const movie = await prisma.movie.findUnique({ where: { id } }).catch(() => null);

  if (!movie) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title={movie.title}
        description="Update status, rating, or notes as you watch."
        action={<DeleteButton id={movie.id} kind="movie" />}
      />
      <MovieForm movie={movie} />
    </div>
  );
}
