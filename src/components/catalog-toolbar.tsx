"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

type Item = {
  id: string;
  title: string;
  status: string;
};

export function CatalogToolbar<T extends Item>({
  items,
  statuses,
  children,
}: {
  items: T[];
  statuses: Array<{ value: string; label: string }>;
  children: (filtered: T[]) => React.ReactNode;
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ALL");

  const filtered = useMemo(() => {
    const normalized = query.toLowerCase().trim();
    return items.filter((item) => {
      const matchesQuery = !normalized || item.title.toLowerCase().includes(normalized);
      const matchesStatus = status === "ALL" || item.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [items, query, status]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <label className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search titles"
            className="w-full rounded-full border border-zinc-200 bg-white py-3 pl-11 pr-4 text-sm outline-none ring-zinc-400/20 focus:ring-4 dark:border-white/10 dark:bg-white/5"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          <FilterChip active={status === "ALL"} onClick={() => setStatus("ALL")} label="All" />
          {statuses.map((item) => (
            <FilterChip
              key={item.value}
              active={status === item.value}
              onClick={() => setStatus(item.value)}
              label={item.label}
            />
          ))}
        </div>
      </div>
      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-zinc-300 p-10 text-center text-sm text-zinc-500 dark:border-white/15">
          No titles match that filter.
        </div>
      ) : (
        children(filtered)
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "rounded-full bg-zinc-950 px-3 py-2 text-xs font-medium text-white dark:bg-white dark:text-zinc-950"
          : "rounded-full border border-zinc-200 px-3 py-2 text-xs font-medium text-zinc-600 dark:border-white/10 dark:text-zinc-300"
      }
    >
      {label}
    </button>
  );
}
