import { getBooks } from "../../../db";

export async function GET() {
  const books = await getBooks();
  return Response.json(books);
}
