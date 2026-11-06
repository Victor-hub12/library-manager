import "server-only";
import postgres from "postgres";

export type BookRow = {
  id: number;
  title: string;
  year: number | null;
  author: string;
  member: string | null;
  dueOn: string | null;
};

export type MemberRow = {
  id: number;
  name: string;
  phone: string | null;
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

export async function getMembers() {
  return getClient()<MemberRow[]>`
    select id, name, phone
    from members
    order by lower(name), id
  `;
}

export async function addMember(name: string, phone: string | null) {
  await getClient()`
    insert into members (name, phone)
    values (${name}, ${phone})
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

export async function updateBook(
  id: number,
  title: string,
  authorName: string,
  year: number,
) {
  return getClient().begin(async (transaction) => {
    const [book] = await transaction<{ id: number }[]>`
      select id from books where id = ${id} for update
    `;

    if (!book) {
      return false;
    }

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
      update books
      set title = ${title}, author_id = ${author.id}, year = ${year}
      where id = ${id}
    `;

    return true;
  });
}

export async function deleteBook(id: number) {
  return getClient().begin(async (transaction) => {
    const [book] = await transaction<{ id: number }[]>`
      select id from books where id = ${id} for update
    `;

    if (!book) {
      return "not-found" as const;
    }

    const [openLoan] = await transaction<{ id: number }[]>`
      select id
      from loans
      where book_id = ${id} and returned_on is null
      limit 1
    `;

    if (openLoan) {
      return "on-loan" as const;
    }

    await transaction`delete from books where id = ${id}`;
    return "deleted" as const;
  });
}
