"use server";

import { revalidatePath } from "next/cache";
import { addBook, addMember, deleteBook, updateBook } from "../db";

export type ActionState = {
  message: string;
  status: "error" | "success" | null;
};

const currentYear = () => new Date().getFullYear();

type BookValidation =
  | { ok: true; year: number }
  | { ok: false; error: string };

function getFormString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function validateBook(
  title: string,
  author: string,
  yearInput: string,
): BookValidation {
  if (!title) {
    return { ok: false, error: "Enter a book title." };
  }

  if (!author) {
    return { ok: false, error: "Enter an author name." };
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
      ok: false,
      error: `Enter a valid year between 1 and ${latestYear}.`,
    };
  }

  return { ok: true, year };
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

  if (!validation.ok) {
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

  if (!validation.ok) {
    return { message: validation.error, status: "error" };
  }

  const updated = await updateBook(id, title, author, validation.year);
  if (!updated) {
    return { message: "This book no longer exists.", status: "error" };
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

export async function addMemberAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const name = getFormString(formData, "name");
  const phone = getFormString(formData, "phone");

  if (!name) {
    return { message: "Enter a member name.", status: "error" };
  }

  await addMember(name, phone || null);
  revalidatePath("/members");

  return { message: `${name} was added as a member.`, status: "success" };
}
