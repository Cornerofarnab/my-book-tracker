export function DatabaseEmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-zinc-300 bg-white p-8 dark:border-white/15 dark:bg-white/5">
      <h2 className="text-xl font-semibold">
        Set up the local database to start tracking
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
        Lumina uses Neon Postgres. Generate the Prisma client, push the schema,
        and seed sample books and movies.
      </p>
      <pre className="mt-5 overflow-x-auto rounded-2xl bg-zinc-950 p-4 text-xs text-zinc-100">
        {`npx prisma generate
npx prisma db push
npx prisma db seed`}
      </pre>
    </div>
  );
}
