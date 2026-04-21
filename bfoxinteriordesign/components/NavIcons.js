// ! Has to be "use client" because BackIcon uses useRouter().back(), which
// only exists in the browser. HomeIcon doesn't strictly need it, but the
// two icons always render together so I'm keeping them side-by-side in
// one file.
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

// Drawn straight as inline SVG instead of using an image — it's a simple
// one-color shape, it scales to any size cleanly, and nothing extra has
// to load. The Tailwind text color controls the stroke via currentColor.
export function HomeIcon() {
  return (
    <Link
      href="/"
      aria-label="Return to home"
      className="inline-flex items-center justify-center text-white hover:opacity-80 transition"
    >
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <path
          d="M6 19 L20 7 L34 19 M10 17 V32 H30 V17"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
}

// router.back() follows the browser history, not the section order. So if
// someone lands straight on /cafe/construction from a link, "back" takes
// them wherever they came from — not to /cafe/context-planning.
// ? Revisit whether this should mirror the prev-section link instead.
export function BackIcon() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.back()}
      aria-label="Go back"
      className="inline-flex items-center justify-center text-white hover:opacity-80 transition"
    >
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <path
          d="M30 20 H10 M17 12 L10 20 L17 28"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </button>
  );
}

export function TopLeftNav() {
  return (
    <div className="fixed top-6 left-8 z-30 flex items-center gap-4">
      <HomeIcon />
      <BackIcon />
    </div>
  );
}
