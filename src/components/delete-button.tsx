"use client";

import { usePathname } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteBook } from "@/actions/books";
import { deleteMovie } from "@/actions/movies";
import { cn } from "@/lib/utils";

function nextAfterDelete(pathname: string, kind: "book" | "movie") {
  if (kind === "book" && pathname.startsWith("/books/")) return "/books";
  if (kind === "movie" && pathname.startsWith("/movies/")) return "/movies";
  return pathname || "/";
}

export function DeleteButton({
  id,
  kind,
  compact = false,
}: {
  id: string;
  kind: "book" | "movie";
  compact?: boolean;
}) {
  const pathname = usePathname();

  return (
    <form
      action={async () => {
        const confirmed = window.confirm(`Delete this ${kind}?`);
        if (!confirmed) return;
        const nextPath = nextAfterDelete(pathname, kind);
        if (kind === "book") {
          await deleteBook(id, nextPath);
        } else {
          await deleteMovie(id, nextPath);
        }
      }}
    >
      <button
        type="submit"
        aria-label={`Delete ${kind}`}
        className={cn(
          "inline-flex items-center justify-center text-rose-700 hover:bg-rose-50 dark:text-rose-200 dark:hover:bg-rose-400/10",
          compact
            ? "rounded-full p-2"
            : "rounded-full border border-rose-200 px-4 py-2 text-sm dark:border-rose-400/20",
        )}
      >
        {compact ? <Trash2 className="h-4 w-4" /> : "Delete"}
      </button>
    </form>
  );
}
