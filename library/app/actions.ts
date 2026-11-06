"use server";

import { revalidatePath } from "next/cache";
import { addBook } from "../db";

export type AddBookState = {
  message: string;
  status: "error" | "success" | null;
};

function getFormString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function addBookAction(
  _previousState: AddBookState,
  formData: FormData,
): Promise<AddBookState> {
  const title = getFormString(formData, "title");
  const author = getFormString(formData, "author");
  const yearInput = getFormString(formData, "year");

  if (!title) {
    return { message: "Enter a book title.", status: "error" };
  }

  if (!author) {
    return { message: "Enter an author name.", status: "error" };
  }

  const year = Number(yearInput);
  const currentYear = new Date().getFullYear();

  if (
    !/^\d{1,4}$/.test(yearInput) ||
    !Number.isSafeInteger(year) ||
    year < 1 ||
    year > currentYear
  ) {
    return {
      message: `Enter a valid year between 1 and ${currentYear}.`,
      status: "error",
    };
  }

  await addBook(title, author, year);
  revalidatePath("/");

  return { message: `"${title}" was added to the library.`, status: "success" };
}
