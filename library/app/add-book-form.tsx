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
    <section className="form-panel">
      <header className="form-panel-header">
        <span aria-hidden="true" className="form-panel-icon">
          <svg fill="none" viewBox="0 0 24 24">
            <path
              d="M5 5.75A2.75 2.75 0 0 1 7.75 3H20v16H7.75A2.75 2.75 0 0 0 5 21.75v-16ZM5 18.5A2.5 2.5 0 0 1 7.5 16H20M9 7h7"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.7"
            />
          </svg>
        </span>
        <div>
          <h2>Add to the shelves</h2>
          <p>Bring another good read into the collection.</p>
        </div>
      </header>

      <form action={formAction} className="form-panel-body grid gap-3">
        <div>
          <label className="form-label" htmlFor="title">Book title</label>
          <input
            autoComplete="off"
            className="form-input"
            id="title"
            name="title"
            placeholder="e.g. Things Fall Apart"
            required
          />
        </div>
        <div>
          <label className="form-label" htmlFor="author">Author</label>
          <input
            autoComplete="off"
            className="form-input"
            id="author"
            name="author"
            placeholder="Writer's name"
            required
          />
        </div>
        <div>
          <label className="form-label" htmlFor="year">Year published</label>
          <input
            className="form-input"
            id="year"
            max="9999"
            min="1"
            name="year"
            placeholder="e.g. 1958"
            required
            type="number"
          />
        </div>
        <div className="grid gap-3 pt-1">
          <button
            className="primary-button w-full"
            disabled={isPending}
            type="submit"
          >
            <span aria-hidden="true">+</span>
            {isPending ? "Adding to collection…" : "Add book"}
          </button>
          {state.message && (
            <p
              aria-live="polite"
              className={
                state.status === "error"
                  ? "m-0 text-xs font-medium text-red-700"
                  : "m-0 text-xs font-medium text-emerald-800"
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
