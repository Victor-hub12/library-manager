import { Suspense } from "react";
import TrashBookActions from "./trash-book-actions";
import { getTrashedBooks } from "../../db";

async function TrashContents() {
  const books = await getTrashedBooks();

  return (
    <section aria-label="Deleted books" className="collection-column">
      <div className="collection-heading">
        <h2>Deleted books</h2>
        <span className="count-label">
          {books.length} {books.length === 1 ? "book" : "books"}
        </span>
      </div>

      {books.length === 0 ? (
        <div className="empty-state">
          <span aria-hidden="true" className="empty-state-mark">⌫</span>
          <p>Trash is empty. Books you move here will appear on this page.</p>
        </div>
      ) : (
        <ul className="book-list trash-book-list">
          {books.map((book) => (
            <li className="book-row trash-book-row" key={book.id}>
              <div className="trash-book-details">
                <h3 className="book-name">{book.title}</h3>
                <p className="book-byline">
                  {book.author}
                  {book.year !== null && ` · ${book.year}`}
                  {` · Deleted ${book.deletedAt}`}
                </p>
              </div>
              <TrashBookActions book={book} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function TrashLoading() {
  return (
    <div aria-busy="true" className="loading-card">
      Loading Trash…
    </div>
  );
}

export default function TrashPage() {
  return (
    <main className="members-catalog-main">
      <header className="catalog-title-row members-title-row">
        <div className="catalog-title-wrap">
          <h1>Trash</h1>
          <span className="catalog-title-chevron">›</span>
        </div>
      </header>
      <p className="trash-description">
        Restore books to your library or permanently delete them.
      </p>
      <Suspense fallback={<TrashLoading />}>
        <TrashContents />
      </Suspense>
    </main>
  );
}
