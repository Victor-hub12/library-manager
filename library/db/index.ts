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

let client: ReturnType<typeof postgres> | undefined;

function getClient() {
  if (client) {
    return client;
  }

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL must be set to access the library database.");
  }

  client = postgres(databaseUrl);
  return client;
}

export async function getBooks() {
  return getClient()<BookRow[]>`
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

export async function addBook(title: string, authorName: string, year: number) {
  await getClient().begin(async (transaction) => {
    const [author] = await transaction<{ id: number }[]>`
      insert into authors (name)
      values (${authorName})
      on conflict (name) do update set name = excluded.name
      returning id
    `;

    if (!author) {
      throw new Error("The author could not be saved.");
    }

    await transaction`
      insert into books (title, author_id, year)
      values (${title}, ${author.id}, ${year})
    `;
  });
}
