"use client";

import { useActionState } from "react";
import { addMemberAction, type ActionState } from "./actions";

const initialState: ActionState = { message: "", status: null };

export default function AddMemberForm() {
  const [state, formAction, isPending] = useActionState(
    addMemberAction,
    initialState,
  );

  return (
    <section className="form-panel">
      <header className="form-panel-header">
        <span aria-hidden="true" className="form-panel-icon">
          <svg fill="none" viewBox="0 0 24 24">
            <path
              d="M16 20v-1.6a3.4 3.4 0 0 0-3.4-3.4H7.4A3.4 3.4 0 0 0 4 18.4V20m15 0v-1.6a3.4 3.4 0 0 0-2.5-3.28M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm6-7.7a4 4 0 0 1 0 7.75"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.7"
            />
          </svg>
        </span>
        <div>
          <h2>Welcome a reader</h2>
          <p>Add someone to your library community.</p>
        </div>
      </header>

      <form action={formAction} className="form-panel-body grid gap-3">
        <div>
          <label className="form-label" htmlFor="member-name">Full name</label>
          <input
            autoComplete="name"
            className="form-input"
            id="member-name"
            name="name"
            placeholder="e.g. Bola Ade"
            required
          />
        </div>

        <div>
          <label className="form-label" htmlFor="member-phone">
            Phone number <span className="font-normal text-stone-500">(optional)</span>
          </label>
          <input
            autoComplete="tel"
            className="form-input"
            id="member-phone"
            name="phone"
            placeholder="e.g. 0801 234 5678"
            type="tel"
          />
        </div>

        <div className="grid gap-3 pt-1">
          <button
            className="primary-button w-full"
            disabled={isPending}
            type="submit"
          >
            <span aria-hidden="true">+</span>
            {isPending ? "Adding reader…" : "Add member"}
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
