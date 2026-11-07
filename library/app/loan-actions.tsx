"use client";

import { useActionState } from "react";
import {
  lendBookAction,
  returnBookAction,
  type ActionState,
} from "./actions";
import type { MemberRow } from "../db";

const initialState: ActionState = { message: "", status: null };

type LoanActionsProps = {
  bookId: number;
  isOnLoan: boolean;
  members: MemberRow[];
};

function ActionMessage({ state }: { state: ActionState }) {
  if (!state.message) {
    return null;
  }

  return (
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
  );
}

export default function LoanActions({
  bookId,
  isOnLoan,
  members,
}: LoanActionsProps) {
  const [lendState, lendFormAction, isLending] = useActionState(
    lendBookAction,
    initialState,
  );
  const [returnState, returnFormAction, isReturning] = useActionState(
    returnBookAction,
    initialState,
  );

  if (isOnLoan) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <form action={returnFormAction}>
          <input name="bookId" type="hidden" value={bookId} />
          <button
            className="secondary-button disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isReturning}
            type="submit"
          >
            {isReturning ? "Returning…" : "Record return"}
          </button>
        </form>
        <ActionMessage state={returnState} />
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <p className="text-sm text-stone-500">
        Add a member before lending this book.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <form action={lendFormAction} className="flex flex-wrap items-center gap-2">
        <input name="bookId" type="hidden" value={bookId} />
        <label className="sr-only" htmlFor={`member-${bookId}`}>
          Member to lend to
        </label>
        <select
          className="form-input min-h-[33px] max-w-56 py-1.5"
          defaultValue=""
          id={`member-${bookId}`}
          name="memberId"
          required
        >
          <option disabled value="">
            Choose a member
          </option>
          {members.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
        </select>
        <button
          className="primary-button min-h-[33px] px-3 disabled:cursor-not-allowed"
          disabled={isLending}
          type="submit"
        >
          {isLending ? "Lending…" : "Lend"}
        </button>
      </form>
      <ActionMessage state={lendState} />
    </div>
  );
}
