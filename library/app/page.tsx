import { Suspense } from "react";
import { getBooks } from "../db";

function formatDueDate(dueOn: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(`${dueOn}T00:00:00Z`));
}

async function BooksList() {
  const books = await getBooks();

  return (
    <section aria-label="Books" className="mt-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-stone-500">
          All books
        </h2>
        <span className="rounded-full bg-stone-200 px-3 py-1 text-sm font-medium text-stone-700">
          {books.length} {books.length === 1 ? "book" : "books"}
        </span>
      </div>

      {books.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-stone-300 bg-white p-8 text-center text-stone-600">
          No books yet.
        </p>
      ) : (
        <ul className="divide-y divide-stone-200 overflow-hidden rounded-2xl border border-stone-200 bg-white">
          {books.map((book) => (
            <li
              key={book.id}
              className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"
            >
              <div className="min-w-0">
                <h3 className="font-semibold text-stone-900">{book.title}</h3>
                <p className="mt-1 text-sm text-stone-600">
                  {book.author}
                  {book.year !== null && (
                    <span className="text-stone-400"> · {book.year}</span>
                  )}
                </p>
              </div>

              {book.member && book.dueOn ? (
                <p className="inline-flex w-fit items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-900">
                  <span
                    aria-hidden="true"
                    className="size-2 rounded-full bg-amber-500"
                  />
                  On loan to {book.member}, due {formatDueDate(book.dueOn)}
                </p>
              ) : (
                <p className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-900">
                  <span
                    aria-hidden="true"
                    className="size-2 rounded-full bg-emerald-500"
                  />
                  Available
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function BooksLoading() {
  return (
    <section
      aria-label="Loading books"
      aria-busy="true"
      className="mt-10 rounded-2xl border border-stone-200 bg-white p-6 text-sm text-stone-500"
    >
      Loading books…
    </section>
  );
}

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-12 sm:px-8 sm:py-16">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-800">
          Community library
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
          Books
        </h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-stone-600">
          Browse the collection and see what’s available on the shelf.
        </p>
      </header>

      <Suspense fallback={<BooksLoading />}>
        <BooksList />
      </Suspense>
    </main>
  );
}
