import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingStars({ value }: { value?: number | null }) {
  const rating = value ?? 0;
  return (
    <div className="flex items-center gap-0.5" aria-label={rating ? `${rating} out of 5` : "Unrated"}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={cn(
            "h-3.5 w-3.5",
            index < rating ? "fill-amber-400 text-amber-400" : "text-zinc-300 dark:text-zinc-600",
          )}
        />
      ))}
    </div>
  );
}
