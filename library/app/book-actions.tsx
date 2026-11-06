"use client";

import { useActionState, useState } from "react";
import {
  deleteBookAction,
  updateBookAction,
  type ActionState,
} from "./actions";
import type { BookRow } from "../db";

const initialState: ActionState = { message: "", status: null };

type BookActionsProps = {
  book: BookRow;
};

export default function BookActions({ book }: BookActionsProps) {
  const [editing, setEditing] = useState(false);
  const [editState, editFormAction, isSaving] = useActionState(
    updateBookAction,
    initialState,
  );
  const [deleteState, deleteFormAction, isDeleting] = useActionState(
    deleteBookAction,
    initialState,
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        className="rounded-lg border border-stone-300 px-3 py-1.5 text-sm font-medium text-stone-700 hover:bg-stone-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
        onClick={() => setEditing((current) => !current)}
        type="button"
      >
        {editing ? "Cancel edit" : "Edit"}
      </button>
      <form action={deleteFormAction}>
        <input name="id" type="hidden" value={book.id} />
        <button
          className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isDeleting}
          type="submit"
        >
          {isDeleting ? "Deleting…" : "Delete"}
        </button>
      </form>
      {deleteState.message && (
        <p
          aria-live="polite"
          className={
            deleteState.status === "error"
              ? "basis-full text-sm font-medium text-red-700"
              : "basis-full text-sm font-medium text-emerald-800"
          }
          role={deleteState.status === "error" ? "alert" : "status"}
        >
          {deleteState.message}
        </p>
      )}
      {editing && (
        <form
          action={editFormAction}
          className="mt-3 grid basis-full gap-3 rounded-xl bg-stone-50 p-4 sm:grid-cols-3"
          key={`${book.id}-${book.title}-${book.author}-${book.year}`}
        >
          <input name="id" type="hidden" value={book.id} />
          <div>
            <label
              className="mb-1 block text-sm font-medium text-stone-700"
              htmlFor={`title-${book.id}`}
            >
              Title
            </label>
            <input
              className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-stone-900 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20"
              defaultValue={book.title}
              id={`title-${book.id}`}
              name="title"
              required
            />
          </div>
          <div>
            <label
              className="mb-1 block text-sm font-medium text-stone-700"
              htmlFor={`author-${book.id}`}
            >
              Author
            </label>
            <input
              className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-stone-900 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20"
              defaultValue={book.author}
              id={`author-${book.id}`}
              name="author"
              required
            />
          </div>
          <div>
            <label
              className="mb-1 block text-sm font-medium text-stone-700"
              htmlFor={`year-${book.id}`}
            >
              Year
            </label>
            <input
              className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-stone-900 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20"
              defaultValue={book.year ?? ""}
              id={`year-${book.id}`}
              max="9999"
              min="1"
              name="year"
              required
              type="number"
            />
          </div>
          <div className="flex flex-col gap-2 sm:col-span-3 sm:flex-row sm:items-center">
            <button
              className="w-fit rounded-lg bg-emerald-800 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSaving}
              type="submit"
            >
              {isSaving ? "Saving…" : "Save changes"}
            </button>
            {editState.message && (
              <p
                aria-live="polite"
                className={
                  editState.status === "error"
                    ? "text-sm font-medium text-red-700"
                    : "text-sm font-medium text-emerald-800"
                }
                role={editState.status === "error" ? "alert" : "status"}
              >
                {editState.message}
              </p>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
