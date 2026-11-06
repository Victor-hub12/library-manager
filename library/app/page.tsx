import { Suspense } from "react";
import BookCatalog from "./book-catalog";
import { getBooks, getMembers } from "../db";

async function BooksPageContent() {
  const [books, members] = await Promise.all([getBooks(), getMembers()]);
  return <BookCatalog books={books} members={members} />;
}

function CatalogLoading() {
  return (
    <main className="catalog-main">
      <div aria-busy="true" className="catalog-loading">
        Loading your books…
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<CatalogLoading />}>
      <BooksPageContent />
    </Suspense>
  );
}
