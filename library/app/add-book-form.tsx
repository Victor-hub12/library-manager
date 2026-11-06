"use client";

import { useActionState } from "react";
import { addBookAction, type ActionState } from "./actions";

const initialState: ActionState = { message: "", status: null };

export default function AddBookForm() {
  const [state, formAction, isPending] = useActionState(
    addBookAction,
    initialState,
  );

  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-semibold text-stone-900">Add a book</h2>
      <p className="mt-1 text-sm text-stone-600">
        Enter the book details to add it to the collection.
      </p>

      <form action={formAction} className="mt-5 grid gap-4 sm:grid-cols-3">
        <div>
          <label
            className="mb-1.5 block text-sm font-medium text-stone-700"
            htmlFor="title"
          >
            Title
          </label>
          <input
            autoComplete="off"
            className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-stone-900 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20"
            id="title"
            name="title"
            required
          />
        </div>
        <div>
          <label
            className="mb-1.5 block text-sm font-medium text-stone-700"
            htmlFor="author"
          >
            Author
          </label>
          <input
            autoComplete="off"
            className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-stone-900 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20"
            id="author"
            name="author"
            required
          />
        </div>
        <div>
          <label
            className="mb-1.5 block text-sm font-medium text-stone-700"
            htmlFor="year"
          >
            Year
          </label>
          <input
            className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-stone-900 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20"
            id="year"
            max="9999"
            min="1"
            name="year"
            required
            type="number"
          />
        </div>
        <div className="flex flex-col gap-3 sm:col-span-3 sm:flex-row sm:items-center">
          <button
            className="rounded-lg bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isPending}
            type="submit"
          >
            {isPending ? "Adding book…" : "Add book"}
          </button>
          {state.message && (
            <p
              aria-live="polite"
              className={
                state.status === "error"
                  ? "text-sm font-medium text-red-700"
                  : "text-sm font-medium text-emerald-800"
              }
              role={state.status === "error" ? "alert" : "status"}
            >
              {state.message}
            </p>
          )}
        </div>
      </form>
    </section>
  );
}
