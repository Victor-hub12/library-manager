"use client";

import { useMemo, useState } from "react";
import AddBookForm from "./add-book-form";
import BookActions from "./book-actions";
import LoanActions from "./loan-actions";
import type { BookRow, MemberRow } from "../db";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

type BookCatalogProps = {
  books: BookRow[];
  members: MemberRow[];
};

function SearchIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="1.8" />
      <path d="m16 16 4.5 4.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  );
}

function formatDueDate(dueOn: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(`${dueOn}T00:00:00Z`));
}

function BookCover({ book, index }: { book: BookRow; index: number }) {
  const initials = book.title
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <div
      aria-label={`Illustrated cover placeholder for ${book.title}`}
      className={`catalog-cover cover-style-${(index % 6) + 1}`}
      role="img"
    >
      <span className="cover-topline">{book.year || "LIBRARY EDITION"}</span>
      <span className="cover-ornament" aria-hidden="true">{initials}</span>
      <span className="cover-title">{book.title}</span>
      <span className="cover-author">{book.author}</span>
    </div>
  );
}

export default function BookCatalog({ books, members }: BookCatalogProps) {
  const [query, setQuery] = useState("");
  const [letter, setLetter] = useState("ALL");
  const [availability, setAvailability] = useState("all");
  const [sortBy, setSortBy] = useState("title");
  const [descending, setDescending] = useState(false);
  const [view, setView] = useState<"cover" | "title">("cover");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  const filteredBooks = useMemo(() => {
    const search = query.trim().toLocaleLowerCase();
    const matching = books.filter((book) => {
      const firstCharacter = book.title.trim().charAt(0).toLocaleUpperCase();
      const matchesLetter =
        letter === "ALL" ||
        (letter === "#" ? !/^[A-Z]$/.test(firstCharacter) : firstCharacter === letter);
      const matchesAvailability =
        availability === "all" ||
        (availability === "available" && !book.member) ||
        (availability === "loaned" && Boolean(book.member));
      const matchesSearch =
        !search ||
        [book.title, book.author, book.member ?? ""].some((value) =>
          value.toLocaleLowerCase().includes(search),
        );

      return matchesLetter && matchesAvailability && matchesSearch;
    });

    const sorted = matching.toSorted((a, b) => {
      const comparison =
        sortBy === "author"
          ? a.author.localeCompare(b.author)
          : sortBy === "year"
            ? (a.year ?? 0) - (b.year ?? 0)
            : a.title.localeCompare(b.title);
      return descending ? -comparison : comparison;
    });

    return sorted;
  }, [availability, books, descending, letter, query, sortBy]);

  const bookGroups = useMemo(() => {
    const groups = new Map<string, BookRow[]>();
    for (const book of filteredBooks) {
      const firstCharacter = book.title.trim().charAt(0).toLocaleUpperCase();
      const group = /^[A-Z]$/.test(firstCharacter) ? firstCharacter : "#";
      const groupBooks = groups.get(group) ?? [];
      groupBooks.push(book);
      groups.set(group, groupBooks);
    }

    return Array.from(groups.entries());
  }, [filteredBooks]);

  const lettersWithBooks = new Set(
    books.map((book) => {
      const firstCharacter = book.title.trim().charAt(0).toLocaleUpperCase();
      return /^[A-Z]$/.test(firstCharacter) ? firstCharacter : "#";
    }),
  );
  const loanedCount = books.filter((book) => book.member !== null).length;

  return (
    <div className="catalog-page">
      <header className="catalog-toolbar">
        <label className="catalog-search">
          <SearchIcon />
          <span className="sr-only">Search books</span>
          <input
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Start searching..."
            type="search"
            value={query}
          />
          {query && (
            <button
              aria-label="Clear search"
              className="clear-search"
              onClick={() => setQuery("")}
              type="button"
            >
              ×
            </button>
          )}
        </label>
        <div className="catalog-account">
          <span>Community Library</span>
          <span aria-hidden="true" className="account-avatar">CL</span>
        </div>
      </header>

      <main className="catalog-main">
        <div className="catalog-title-row">
          <div className="catalog-title-wrap">
            <h1>My Books</h1>
            <span className="catalog-total">{books.length}</span>
            <span aria-hidden="true" className="catalog-title-chevron">›</span>
          </div>
          <div className="catalog-controls">
            <div className="view-switch" aria-label="Book display mode">
              <button
                aria-pressed={view === "cover"}
                className={view === "cover" ? "selected" : ""}
                onClick={() => setView("cover")}
                type="button"
              >
                <span aria-hidden="true">▦</span> Cover
              </button>
              <button
                aria-pressed={view === "title"}
                className={view === "title" ? "selected" : ""}
                onClick={() => setView("title")}
                type="button"
              >
                <span aria-hidden="true">☷</span> Title
              </button>
              <button
                aria-label={descending ? "Sort ascending" : "Sort descending"}
                className="sort-direction"
                onClick={() => setDescending((current) => !current)}
                type="button"
              >
                {descending ? "↑" : "↓"}
              </button>
            </div>
            <button
              aria-expanded={filtersOpen}
              className={`filter-button${filtersOpen ? " selected" : ""}`}
              onClick={() => setFiltersOpen((current) => !current)}
              type="button"
            >
              <span aria-hidden="true">☷</span> Filters
            </button>
            <button
              aria-expanded={addOpen}
              className="add-item-button"
              id="add-book"
              onClick={() => setAddOpen((current) => !current)}
              type="button"
            >
              <span aria-hidden="true">+</span> Add item
            </button>
          </div>
        </div>

        <div className="catalog-subtoolbar">
          <label className="sort-label">
            <span className="sr-only">Sort books by</span>
            <select
              onChange={(event) => setSortBy(event.target.value)}
              value={sortBy}
            >
              <option value="title">Title</option>
              <option value="author">Author</option>
              <option value="year">Year</option>
            </select>
          </label>
          <span className="subtoolbar-count">
            Showing {filteredBooks.length} of {books.length}
          </span>
        </div>

        {filtersOpen && (
          <div className="filter-panel">
            <label htmlFor="availability-filter">Availability</label>
            <select
              id="availability-filter"
              onChange={(event) => setAvailability(event.target.value)}
              value={availability}
            >
              <option value="all">All books</option>
              <option value="available">Available</option>
              <option value="loaned">On loan</option>
            </select>
            <button
              className="filter-reset"
              onClick={() => setAvailability("all")}
              type="button"
            >
              Clear filters
            </button>
          </div>
        )}

        {addOpen && (
          <div className="add-item-panel">
            <AddBookForm />
          </div>
        )}

        <nav aria-label="Filter books by first letter" className="alphabet-nav">
          {alphabet.map((character) => (
            <button
              aria-pressed={letter === character}
              className={letter === character ? "active" : ""}
              disabled={!lettersWithBooks.has(character)}
              key={character}
              onClick={() => setLetter(character)}
              type="button"
            >
              {character}
            </button>
          ))}
          <button
            aria-pressed={letter === "#"}
            className={letter === "#" ? "active" : ""}
            disabled={!lettersWithBooks.has("#")}
            onClick={() => setLetter("#")}
            type="button"
          >
            #
          </button>
          <button
            aria-pressed={letter === "ALL"}
            className={`alphabet-all${letter === "ALL" ? " active" : ""}`}
            onClick={() => setLetter("ALL")}
            type="button"
          >
            ALL
          </button>
        </nav>

        <section aria-label="Book collection" className="catalog-results">
          {filteredBooks.length === 0 ? (
            <div className="catalog-empty">
              <span aria-hidden="true">⌕</span>
              <h2>No books found</h2>
              <p>Try a different search or clear the selected filters.</p>
              <button
                className="filter-reset"
                onClick={() => {
                  setQuery("");
                  setLetter("ALL");
                  setAvailability("all");
                }}
                type="button"
              >
                Clear search and filters
              </button>
            </div>
          ) : view === "cover" ? (
            <div className="catalog-groups">
              {bookGroups.map(([group, groupBooks]) => (
                <section aria-label={`Books starting with ${group}`} className="catalog-group" key={group}>
                  <h2 className="catalog-group-letter">{group}</h2>
                  <ul className="cover-grid">
                    {groupBooks.map((book, index) => (
                      <li className="cover-card" key={book.id}>
                        <BookCover book={book} index={index} />
                        <div className="cover-card-meta">
                          <span
                            className={`status-pill ${
                              book.member ? "status-loan" : "status-available"
                            }`}
                          >
                            {book.member ? "On loan" : "Available"}
                          </span>
                          <h3 title={book.title}>{book.title}</h3>
                          <p>{book.author}</p>
                          {book.member && book.dueOn && (
                            <p className="cover-loan-note">
                              {book.member} · due {formatDueDate(book.dueOn)}
                            </p>
                          )}
                        </div>
                        <details className="cover-card-actions">
                          <summary>Manage book</summary>
                          <div className="cover-card-action-panel">
                            <LoanActions
                              bookId={book.id}
                              isOnLoan={Boolean(book.member)}
                              members={members}
                            />
                            <BookActions book={book} />
                          </div>
                        </details>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          ) : (
            <div className="catalog-groups">
              {bookGroups.map(([group, groupBooks]) => (
                <section aria-label={`Books starting with ${group}`} className="catalog-group" key={group}>
                  <h2 className="catalog-group-letter">{group}</h2>
                  <ul className="title-list">
                    {groupBooks.map((book) => (
                      <li className="title-row" key={book.id}>
                        <span className="title-row-initial" aria-hidden="true">
                          {book.title.charAt(0).toUpperCase()}
                        </span>
                        <div className="title-row-details">
                          <h3>{book.title}</h3>
                          <p>
                            {book.author}
                            {book.year !== null && ` · ${book.year}`}
                            {book.member && book.dueOn
                              ? ` · On loan to ${book.member}, due ${formatDueDate(book.dueOn)}`
                              : ""}
                          </p>
                        </div>
                        <span
                          className={`status-pill ${
                            book.member ? "status-loan" : "status-available"
                          }`}
                        >
                          {book.member ? "On loan" : "Available"}
                        </span>
                        <div className="title-row-actions">
                          <LoanActions
                            bookId={book.id}
                            isOnLoan={Boolean(book.member)}
                            members={members}
                          />
                          <BookActions book={book} />
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </section>

        <footer className="catalog-footer">
          <span>Showing {filteredBooks.length} of {books.length} books</span>
          {loanedCount > 0 && <span>{loanedCount} currently on loan</span>}
        </footer>
      </main>
    </div>
  );
}
