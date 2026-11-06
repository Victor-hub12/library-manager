import "server-only";
import postgres from "postgres";

type BookRow = {
  id: number;
  title: string;
  year: number | null;
  author: string;
  member: string | null;
  dueOn: string | null;
};

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL must be set to load books.");
}

const sql = postgres(databaseUrl);

export async function getBooks() {
  return sql<BookRow[]>`
    select
      books.id,
      books.title,
      books.year,
      authors.name as author,
      members.name as member,
      to_char(loans.due_on, 'YYYY-MM-DD') as "dueOn"
    from books
    join authors on authors.id = books.author_id
    left join loans
      on loans.book_id = books.id
      and loans.returned_on is null
    left join members on members.id = loans.member_id
    order by lower(books.title), books.id
  `;
}
