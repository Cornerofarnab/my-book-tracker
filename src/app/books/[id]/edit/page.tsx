import { notFound } from "next/navigation";
import { BookForm } from "@/components/book-form";
import { DeleteButton } from "@/components/delete-button";
import { PageHeader } from "@/components/page-header";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function EditBookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const book = await prisma.book.findUnique({ where: { id } }).catch(() => null);

  if (!book) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title={book.title}
        description="Update status, rating, or notes as you read."
        action={<DeleteButton id={book.id} kind="book" />}
      />
      <BookForm book={book} />
    </div>
  );
}
