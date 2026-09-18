import { BookForm } from "@/components/book-form";
import { PageHeader } from "@/components/page-header";

export default function NewBookPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Add a book" description="Save a title to your shelf with status, rating, and notes." />
      <BookForm />
    </div>
  );
}
