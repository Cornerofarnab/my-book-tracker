import { MovieForm } from "@/components/movie-form";
import { PageHeader } from "@/components/page-header";

export default function NewMoviePage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Add a movie" description="Save a film to your watchlist with status, rating, and notes." />
      <MovieForm />
    </div>
  );
}
