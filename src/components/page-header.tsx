import { ThemeToggle } from "@/components/theme-toggle";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white">{title}</h1>
        {description ? <p className="mt-1 max-w-xl text-sm text-zinc-500 dark:text-zinc-400">{description}</p> : null}
      </div>
      <div className="flex items-center gap-3">
        {action}
        <ThemeToggle />
      </div>
    </div>
  );
}
