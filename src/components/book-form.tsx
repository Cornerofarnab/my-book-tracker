"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createBook, updateBook, type MediaFormState } from "@/actions/books";
import { BOOK_STATUSES } from "@/lib/utils";
import type { Book } from "@/generated/prisma";

const initialState: MediaFormState = {};

export function BookForm({ book }: { book?: Book }) {
  const action = book
    ? updateBook.bind(null, book.id)
    : createBook;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-5 rounded-3xl border border-zinc-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
      {state.error ? (
        <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:bg-rose-400/10 dark:text-rose-200">
          {state.error}
        </p>
      ) : null}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Title" name="title" defaultValue={book?.title} required />
        <Field label="Author" name="author" defaultValue={book?.author} required />
        <Field label="Genre" name="genre" defaultValue={book?.genre ?? ""} />
        <Field label="Year" name="year" type="number" defaultValue={book?.year ?? ""} />
        <label className="block text-sm">
          <span className="mb-2 block font-medium text-zinc-700 dark:text-zinc-200">Status</span>
          <select
            name="status"
            defaultValue={book?.status ?? "WANT_TO_READ"}
            className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none ring-amber-400/40 focus:ring-4 dark:border-white/10 dark:bg-zinc-950"
          >
            {BOOK_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="mb-2 block font-medium text-zinc-700 dark:text-zinc-200">Rating</span>
          <select
            name="rating"
            defaultValue={book?.rating ?? ""}
            className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none ring-amber-400/40 focus:ring-4 dark:border-white/10 dark:bg-zinc-950"
          >
            <option value="">Unrated</option>
            {[1, 2, 3, 4, 5].map((value) => (
              <option key={value} value={value}>
                {value} star{value === 1 ? "" : "s"}
              </option>
            ))}
          </select>
        </label>
      </div>
      <Field label="Cover URL" name="coverUrl" defaultValue={book?.coverUrl ?? ""} />
      <label className="block text-sm">
        <span className="mb-2 block font-medium text-zinc-700 dark:text-zinc-200">Notes</span>
        <textarea
          name="notes"
          rows={4}
          defaultValue={book?.notes ?? ""}
          className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none ring-amber-400/40 focus:ring-4 dark:border-white/10 dark:bg-zinc-950"
        />
      </label>
      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60 dark:bg-white dark:text-zinc-950"
        >
          {pending ? "Saving..." : book ? "Save changes" : "Add book"}
        </button>
        <Link href="/books" className="rounded-full px-5 py-2.5 text-sm text-zinc-500 hover:text-zinc-950 dark:hover:text-white">
          Cancel
        </Link>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  required,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue?: string | number;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-2 block font-medium text-zinc-700 dark:text-zinc-200">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none ring-amber-400/40 focus:ring-4 dark:border-white/10 dark:bg-zinc-950"
      />
    </label>
  );
}
