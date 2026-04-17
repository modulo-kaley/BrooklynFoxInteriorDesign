import Link from "next/link";
import VinylElement from "@/components/VinylElement";

export default function ProjectLayout({ projectSlug, children }) {
  return (
    <div className="relative min-h-screen bg-stone-50">
      {/* Persistent home icon */}
      <Link
        href="/"
        className="fixed top-4 left-4 z-40 rounded-full bg-white/80 p-3 shadow-lg backdrop-blur transition hover:bg-white"
        aria-label="Back to home"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      </Link>

      {/* Persistent decorative vinyl */}
      <VinylElement position="top-right" size="md" />

      {/* Page content */}
      <main className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
