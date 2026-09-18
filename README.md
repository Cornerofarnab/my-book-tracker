# Lumina — media tracker

Personal tracker for books and movies, built with Next.js 15, TypeScript, Tailwind CSS, Prisma, and SQLite.

## Features

- Book shelf with reading status, ratings, and notes
- Movie watchlist with watch status, ratings, and notes
- Dashboard with counts, averages, recently added titles, and completion stats
- Search and status filters
- Dark mode
- Responsive sidebar + mobile navigation

## Setup

1. Copy environment variables:

```bash
copy .env.example .env
```

2. Install dependencies, generate the Prisma client, push the schema, and seed sample data:

```bash
npm install
npx prisma generate
npx prisma db push
npx prisma db seed
```

3. Run the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
