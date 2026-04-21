// ! This one has to be "use client" — it uses useState to track which tile
// is open in the full-bleed view and useEffect to listen for the Escape
// key. The pieces that don't need state (Vinyl, the SVG nav icons) live
// in their own files so they can stay on the server.
"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { TopLeftNav } from "./NavIcons";
import VinylNavLink from "./VinylNavLink";

// A little registry of grid layouts. The data file just names one
// ("three-panel", "four-grid", "six-grid") and this object holds the actual
// Tailwind classes that go with it. Want a new layout? Add a key here and
// the data file stays clean.
const layoutClasses = {
  "three-panel": {
    grid: "flex gap-6 items-center justify-center",
    tile: "relative aspect-[3/5] h-[min(62vh,500px)] overflow-hidden",
    sizes: "(max-width: 768px) 60vw, 600px",
  },
  "four-grid": {
    grid: "grid grid-cols-2 gap-6",
    tile: "relative aspect-square h-[min(30vh,280px)] overflow-hidden",
    sizes: "(max-width: 768px) 50vw, 700px",
  },
  "six-grid": {
    // flex-wrap + justify-center instead of a 3-col grid so that an
    // incomplete last row (e.g. 5 tiles → 3 on top, 2 below) ends up
    // centered rather than hanging off to the left with a blank gap on
    // the right. A perfect 6 still lays out as 3 + 3.
    grid: "flex flex-wrap gap-5 justify-center items-center max-w-[840px]",
    tile: "relative aspect-square h-[min(30vh,260px)] overflow-hidden",
    sizes: "(max-width: 768px) 40vw, 600px",
  },
};

// Draws a section: the image grid, the prev/next vinyl links, and — when a
// tile is open — the full-bleed overlay on top of everything. prev and next
// are handed in by getSection() so the arrows always match the order in
// the data file, no matter which section we're on.
export default function SectionView({ project, section, prev, next }) {
  // Safety net: if the data file ever picks a layout name that isn't in
  // the registry, fall back to three-panel instead of crashing on
  // undefined.grid.
  const layout = layoutClasses[section.layout] ?? layoutClasses["three-panel"];
  // openTile is null when the overlay is closed. When it's set, that's the
  // tile currently showing full-bleed.
  const [openTile, setOpenTile] = useState(null);

  const close = useCallback(() => setOpenTile(null), []);

  // Only listen for Escape while the overlay is actually open — the cleanup
  // function runs on close (or unmount), so we're never leaving orphaned
  // listeners attached to window.
  // ? A11y revisit: trap focus inside the overlay and send it back to the
  // tile button when it closes.
  useEffect(() => {
    if (!openTile) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openTile, close]);

  return (
    <div className="h-screen wood-surface relative overflow-hidden">
      <TopLeftNav />

      <main className="h-full flex flex-col items-center justify-center px-8 py-20 gap-8">
        <div className={layout.grid}>
          {section.tiles.map((tile, i) => (
            <button
              key={tile.image}
              type="button"
              onClick={() => setOpenTile(tile)}
              // White backdrop sits behind "contain"-fit tiles so the
              // letterboxed edges read as part of the page rather than as
              // a dark gap. Cover-fit tiles fill the frame so the bg is
              // never actually seen.
              className={`${layout.tile} tile-hover shadow-[0_10px_24px_rgba(0,0,0,0.5)] cursor-pointer bg-white`}
              aria-label={`Open ${tile.alt}`}
            >
              <Image
                src={tile.image}
                alt={tile.alt}
                fill
                sizes={layout.sizes}
                // Per-tile opt-out: if a tile's content gets awkwardly
                // cropped by the default square "cover" treatment (think
                // wide photos or bubble diagrams whose edges hang off the
                // square), set fit: "contain" in the data file to show
                // the whole image instead.
                className={tile.fit === "contain" ? "object-contain" : "object-cover"}
                quality={90}
                // Only prioritize the first row — the rest can load lazily.
                // Keeps the first paint fast without telling the browser to
                // preload every image on the page.
                priority={i < 3}
              />
            </button>
          ))}
        </div>

        <h1 className="text-white text-4xl md:text-5xl font-bold tracking-tight text-center drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
          {section.title}
        </h1>
      </main>

      {/*
        If there's a previous section, rewind to it. On the very first
        section there's no previous section to point at, so instead of
        leaving the corner empty we send viewers back to the project's
        intro page — otherwise the only way out is the top-left nav.
      */}
      {prev ? (
        <VinylNavLink
          href={`/${project.id}/${prev.slug}`}
          label={prev.title}
          color={project.vinylColor}
          direction="prev"
          ariaLabel={`Previous section: ${prev.title}`}
        />
      ) : (
        <VinylNavLink
          href={`/${project.id}`}
          label={project.title}
          color={project.vinylColor}
          direction="prev"
          ariaLabel={`Back to ${project.title} intro`}
        />
      )}
      {/*
        Mirror of the prev fallback: if there's no next section, the flow
        has ended — send viewers back to the home shelf instead of
        leaving the corner empty. Yes, it's redundant with the top-left
        home icon, but the vinyl is the affordance viewers have been
        clicking all the way through, so ending on a dead corner feels
        worse than ending on a familiar one.
      */}
      {next ? (
        <VinylNavLink
          href={`/${project.id}/${next.slug}`}
          label={next.title}
          color={project.vinylColor}
          direction="next"
          ariaLabel={`Next section: ${next.title}`}
        />
      ) : (
        <VinylNavLink
          href="/"
          label="Home"
          color={project.vinylColor}
          direction="next"
          ariaLabel="Back to home"
        />
      )}

      {openTile && (
        <FullBleed tile={openTile} onClose={close} />
      )}
    </div>
  );
}

// The full-bleed overlay. Clicking the dark backdrop closes it. The white
// caption card and the Fit/Fill toggle both call stopPropagation so
// clicking them doesn't also close the overlay by accident.
function FullBleed({ tile, onClose }) {
  const [fitMode, setFitMode] = useState("cover");
  const toggleFit = (e) => {
    e.stopPropagation();
    setFitMode((m) => (m === "cover" ? "contain" : "cover"));
  };

  return (
    <div
      className="fixed inset-0 z-40 bg-black fade-in cursor-pointer"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <Image
        src={tile.image}
        alt={tile.alt}
        fill
        sizes="100vw"
        className={`object-cover transition-opacity duration-300 ${
          fitMode === "cover" ? "opacity-100" : "opacity-0"
        }`}
        quality={95}
        priority
      />
      <Image
        src={tile.image}
        alt=""
        fill
        sizes="100vw"
        className={`object-contain transition-opacity duration-300 ${
          fitMode === "contain" ? "opacity-100" : "opacity-0"
        }`}
        quality={95}
        aria-hidden="true"
      />
      {tile.caption && (
        <div
          className="absolute right-16 bottom-16 max-w-[560px] bg-white text-black p-10 shadow-[0_20px_40px_rgba(0,0,0,0.6)] leading-relaxed text-lg"
          onClick={(e) => e.stopPropagation()}
        >
          {tile.caption}
        </div>
      )}
      <button
        type="button"
        onClick={toggleFit}
        aria-label={fitMode === "cover" ? "Fit whole image" : "Fill screen"}
        className="absolute top-6 left-8 text-white/90 hover:text-white text-xs tracking-[0.2em] uppercase bg-black/30 hover:bg-black/50 backdrop-blur-sm px-3 py-2 transition"
      >
        {fitMode === "cover" ? "Fit" : "Fill"}
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Close full bleed view"
        // Same dark backdrop as the Fit/Fill toggle so the × stays readable
        // on bright images — without it, the white glyph vanishes against
        // pale walls, sky, etc.
        className="absolute top-6 right-8 flex items-center justify-center w-10 h-10 text-white/90 hover:text-white text-3xl leading-none bg-black/30 hover:bg-black/50 backdrop-blur-sm transition"
      >
        ×
      </button>
    </div>
  );
}
