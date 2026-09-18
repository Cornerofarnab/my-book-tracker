import { percent } from "@/lib/utils";

type StatusRow = {
  label: string;
  count: number;
  barClass: string;
};

export function CompletionStats({
  title,
  completedLabel,
  completed,
  total,
  rows,
}: {
  title: string;
  completedLabel: string;
  completed: number;
  total: number;
  rows: StatusRow[];
}) {
  const rate = percent(completed, total);

  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="mt-1 text-sm text-zinc-500">
            {completed} of {total} {completedLabel}
          </p>
        </div>
        <p className="text-2xl font-semibold tracking-tight">{rate}%</p>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-white/10">
        <div className="h-full rounded-full bg-emerald-500" style={{ width: `${rate}%` }} />
      </div>
      <ul className="mt-5 space-y-3">
        {rows.map((row) => {
          const share = percent(row.count, total);
          return (
            <li key={row.label}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-zinc-600 dark:text-zinc-300">{row.label}</span>
                <span className="text-zinc-500">
                  {row.count} · {share}%
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-white/10">
                <div className={`h-full rounded-full ${row.barClass}`} style={{ width: `${share}%` }} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
