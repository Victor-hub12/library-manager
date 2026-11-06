"use server";

import { revalidatePath } from "next/cache";
import { addBook, deleteBook, updateBook } from "../db";

export type ActionState = {
  message: string;
  status: "error" | "success" | null;
};

const emptyState: ActionState = { message: "", status: null };
const currentYear = () => new Date().getFullYear();

function getFormString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function validateBook(title: string, author: string, yearInput: string) {
  if (!title) {
    return { error: "Enter a book title." } as const;
  }

  if (!author) {
    return { error: "Enter an author name." } as const;
  }

  const year = Number(yearInput);
  const latestYear = currentYear();

  if (
    !/^\d{1,4}$/.test(yearInput) ||
    !Number.isSafeInteger(year) ||
    year < 1 ||
    year > latestYear
  ) {
    return {
      error: `Enter a valid year between 1 and ${latestYear}.`,
    } as const;
  }

  return { year } as const;
}

function getBookId(formData: FormData) {
  const idInput = getFormString(formData, "id");
  if (!/^[1-9]\d*$/.test(idInput)) {
    return null;
  }

  const id = Number(idInput);
  return Number.isSafeInteger(id) ? id : null;
}

export async function addBookAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const title = getFormString(formData, "title");
  const author = getFormString(formData, "author");
  const yearInput = getFormString(formData, "year");
  const validation = validateBook(title, author, yearInput);

  if ("error" in validation) {
    return { message: validation.error, status: "error" };
  }

  await addBook(title, author, validation.year);
  revalidatePath("/");

  return { message: `"${title}" was added to the library.`, status: "success" };
}

export async function updateBookAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = getBookId(formData);
  if (id === null) {
    return { message: "This book has an invalid ID.", status: "error" };
  }

  const title = getFormString(formData, "title");
  const author = getFormString(formData, "author");
  const yearInput = getFormString(formData, "year");
  const validation = validateBook(title, author, yearInput);

  if ("error" in validation) {
    return { message: validation.error, status: "error" };
  }

  try {
    await updateBook(id, title, author, validation.year);
  } catch (error) {
    if (error instanceof Error && error.message === "That book no longer exists.") {
      return { message: error.message, status: "error" };
    }

    throw error;
  }

  revalidatePath("/");
  return { message: "Book details saved.", status: "success" };
}

export async function deleteBookAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = getBookId(formData);
  if (id === null) {
    return { message: "This book has an invalid ID.", status: "error" };
  }

  const result = await deleteBook(id);

  if (result === "on-loan") {
    return {
      message: "This book is on loan. Record its return before deleting it.",
      status: "error",
    };
  }

  if (result === "not-found") {
    return { message: "This book no longer exists.", status: "error" };
  }

  revalidatePath("/");
  return { message: "Book deleted.", status: "success" };
}

export { emptyState };
