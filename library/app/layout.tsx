import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Books | Community Library",
  description: "Browse the community library collection and loan status.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <nav
          aria-label="Main navigation"
          className="border-b border-stone-200 bg-white"
        >
          <div className="mx-auto flex w-full max-w-5xl gap-6 px-5 sm:px-8">
            <Link
              className="border-b-2 border-transparent py-4 text-sm font-medium text-stone-600 hover:border-emerald-800 hover:text-emerald-900"
              href="/"
            >
              Books
            </Link>
            <Link
              className="border-b-2 border-transparent py-4 text-sm font-medium text-stone-600 hover:border-emerald-800 hover:text-emerald-900"
              href="/members"
            >
              Members
            </Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
