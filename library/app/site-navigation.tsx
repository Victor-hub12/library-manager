"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function BooksIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="M5 5.75A2.75 2.75 0 0 1 7.75 3H20v16H7.75A2.75 2.75 0 0 0 5 21.75v-16Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <path
        d="M5 18.5A2.5 2.5 0 0 1 7.5 16H20M9 7h7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function MembersIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="M16 20v-1.6a3.4 3.4 0 0 0-3.4-3.4H7.4A3.4 3.4 0 0 0 4 18.4V20m15 0v-1.6a3.4 3.4 0 0 0-2.5-3.28M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm6-7.7a4 4 0 0 1 0 7.75"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

const links = [
  { href: "/", label: "Library", Icon: BooksIcon },
  { href: "/members", label: "Members", Icon: MembersIcon },
];

export default function SiteNavigation() {
  const pathname = usePathname();

  return (
    <>
      <aside className="sidebar">
        <Link aria-label="Community Library home" className="brand" href="/">
          <span className="brand-wordmark">libib</span>
          <span aria-hidden="true" className="brand-logo"><BooksIcon /></span>
        </Link>

        <p className="nav-heading">YOUR LIBRARY</p>
        <nav aria-label="Main navigation" className="side-nav">
          <Link
            aria-current={pathname === "/" ? "page" : undefined}
            className={`side-nav-link${pathname === "/" ? " active" : ""}`}
            href="/"
          >
            <span className="nav-icon"><BooksIcon /></span>
            Library
          </Link>
          <Link className="side-nav-link" href="/#add-book">
            <span className="nav-icon nav-plus" aria-hidden="true">+</span>
            Add Items
          </Link>
        </nav>

        <p className="nav-heading nav-heading-secondary">MANAGE</p>
        <nav aria-label="Library management" className="side-nav">
          <Link
            aria-current={pathname === "/members" ? "page" : undefined}
            className={`side-nav-link${pathname === "/members" ? " active" : ""}`}
            href="/members"
          >
            <span className="nav-icon"><MembersIcon /></span>
            Members
          </Link>
        </nav>

        <div className="sidebar-footer">
          <span aria-hidden="true" className="sidebar-avatar">CL</span>
          <span>
            <strong>Community library</strong>
            <small>Library manager</small>
          </span>
        </div>
      </aside>

      <header className="mobile-header">
        <Link aria-label="Commonplace Library home" className="brand" href="/">
          <span className="brand-wordmark">libib</span>
          <span aria-hidden="true" className="brand-logo"><BooksIcon /></span>
        </Link>
        <nav aria-label="Main navigation" className="mobile-nav">
          {links.map(({ href, label }) => (
            <Link
              aria-current={pathname === href ? "page" : undefined}
              className={pathname === href ? "active" : ""}
              href={href}
              key={href}
            >
              {label}
            </Link>
          ))}
        </nav>
      </header>
    </>
  );
}
