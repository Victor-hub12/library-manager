"use client";

import { useActionState } from "react";
import {
  permanentlyDeleteBookAction,
  restoreBookAction,
  type ActionState,
} from "../actions";
import type { TrashBookRow } from "../../db";

const initialState: ActionState = { message: "", status: null };

export default function TrashBookActions({ book }: { book: TrashBookRow }) {
  const [restoreState, restoreFormAction, isRestoring] = useActionState(
    restoreBookAction,
    initialState,
  );
  const [deleteState, deleteFormAction, isDeleting] = useActionState(
    permanentlyDeleteBookAction,
    initialState,
  );

  return (
    <div className="trash-book-actions">
      <form action={restoreFormAction}>
        <input name="id" type="hidden" value={book.id} />
        <button className="secondary-button" disabled={isRestoring} type="submit">
          {isRestoring ? "Restoring…" : "Restore"}
        </button>
      </form>
      <form
        action={deleteFormAction}
        onSubmit={(event) => {
          if (!window.confirm(`Permanently delete "${book.title}"? This cannot be undone.`)) {
            event.preventDefault();
          }
        }}
      >
        <input name="id" type="hidden" value={book.id} />
        <button className="danger-button" disabled={isDeleting} type="submit">
          {isDeleting ? "Deleting…" : "Delete forever"}
        </button>
      </form>
      {(restoreState.message || deleteState.message) && (
        <p
          aria-live="polite"
          className={
            restoreState.status === "error" || deleteState.status === "error"
              ? "trash-action-message error"
              : "trash-action-message"
          }
          role={
            restoreState.status === "error" || deleteState.status === "error"
              ? "alert"
              : "status"
          }
        >
          {restoreState.message || deleteState.message}
        </p>
      )}
    </div>
  );
}
