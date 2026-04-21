# For Future Updates

> Created April 20, 2026

## Features

### Navigation & Layout

- **Home shelf** — 3 project thumbnails on a wood-texture background.
  Hover = vinyl peeks up from behind (spring physics via `motion/react`).
- **Intro screens** — Hero image + title, with corner vinyl CTAs forward
  (first section) and back (home).
- **Linear section flow** — Prev/next corner vinyls spin forward 360° on
  every hover. No dead corners: first-section "prev" goes back to intro,
  last-section "next" goes back to home.
- **Top-left nav cluster** — Home icon + Back icon (`router.back()`) on
  every view.

### Image Interactions

- **Grid layouts** — Three presets (`three-panel`, `four-grid`, `six-grid`), picked per section in the data file.
- **Tile hover** — Smooth scale-up via the `tile-hover` CSS class.
- **Full-bleed view** — Click any tile for a full-viewport overlay with a floating caption card. Click backdrop to dismiss; click card to stay.
- **Fit / Fill toggle** — Corner toggle inside the overlay cross-fades between `object-cover` (crops) and `object-contain` (letterboxed).
- **Per-tile `fit` override** — Any tile can set `fit: "contain"` in the data to opt out of the default square crop.
- **Keyboard** — Escape closes the overlay.

### Under the Hood

- Fluid sizing via `clamp()` + `next/image` `sizes` hints per layout.
- Fixed wood background on `<body>` (doesn't reload between pages).

---

## Tech Stack

| Category         | Technology                                |
| ---------------- | ----------------------------------------- |
| Framework        | Next.js 16 (App Router)                   |
| UI               | React 19 (w/ React Compiler)              |
| Styling          | Tailwind CSS 4                            |
| Animation        | Motion (formerly Framer Motion)           |
| Image Handling   | next/image                                |
| Image Prep       | sharp (via local `downscale-images.mjs`)  |
| Content          | Local data file (`data/projects.js`)      |
| Deployment       | Vercel                                    |
| Version Control  | GitHub                                    |
| Design Reference | Figma prototype (via Figma MCP)           |
| AI Collaboration | Claude (Anthropic), with Figma MCP bridge |

---

## Project Structure

Two dynamic segments — `/[album]/[track]` — instead of one folder per
project. All 12 routes (1 home + 3 intros + 9 sections) are pre-rendered
statically from the data file.

> _Naming note: "album" = a project, "track" = a section.

```text
bfoxinteriordesign/
├── app/
│   ├── layout.js                  # Root layout: Poppins font, wood bg, metadata
│   ├── page.js                    # Home / hero — wood bg, shelf, 3 thumbnails
│   ├── globals.css                # Tailwind import + .wood-surface, .tile-hover, .fade-in
│   ├── favicon.ico
│   └── [album]/
│       ├── page.js                # Project intro — renders <IntroView>
│       └── [track]/
│           └── page.js            # Section page — renders <SectionView>
├── components/
│   ├── HomeProjectTile.js         # Client: home-shelf tile w/ vinyl peek-up on hover
│   ├── IntroView.js               # Server: hero image + title + corner vinyl CTAs
│   ├── SectionView.js             # Client: image grid + full-bleed modal + prev/next
│   ├── NavIcons.js                # Client: HomeIcon, BackIcon, TopLeftNav cluster
│   ├── VinylNavLink.js            # Client: shared corner CTA w/ accumulating spin
│   └── Vinyl.js                   # Decorative SVG record (color/size via props)
├── data/
│   └── projects.js                # Single source of truth — projects, sections, tiles
├── public/
│   └── images/
│       ├── home/                  # Home-screen assets (wood bg, shelf, thumbs)
│       ├── office/                # Office project imagery
│       ├── cafe/                  # Cafe project imagery
│       └── home-interior/         # Home-interior project imagery
├── scripts/
│   └── downscale-images.mjs       # Image-prep utility (run manually, not at build)
├── jsconfig.json
├── next.config.mjs
├── postcss.config.mjs
└── package.json
```

### Routes (all statically generated)

| Route                               | Renders       | Layout        | Description                                  |
| ----------------------------------- | ------------- | ------------- | -------------------------------------------- |
| `/`                                 | `app/page.js` | —             | Hero: wood bg, shelf, 3 vinyl-peek thumbs    |
| `/office`                           | `IntroView`   | —             | Office entry — hero image + corner CTAs      |
| `/office/concept-imagery`           | `SectionView` | `three-panel` | Tall 3-tile concept grid                     |
| `/office/context-planning`          | `SectionView` | `four-grid`   | 2×2 render grid                              |
| `/office/construction`              | `SectionView` | `six-grid`    | Plans, boards, renders, sketches             |
| `/cafe`                             | `IntroView`   | —             | Cafe entry — hero image + corner CTAs        |
| `/cafe/floor-plans`                 | `SectionView` | `three-panel` | Tall 3-tile floor-plan grid                  |
| `/cafe/context-planning`            | `SectionView` | `six-grid`    | Context renders (5 tiles, centered wrap)     |
| `/cafe/construction`                | `SectionView` | `six-grid`    | Construction documentation imagery           |
| `/home-interior`                    | `IntroView`   | —             | Home entry — hero image + corner CTAs        |
| `/home-interior/floors`             | `SectionView` | `three-panel` | Floor plans (basement, main, upper)          |
| `/home-interior/stair-construction` | `SectionView` | `three-panel` | Stair section, render, handrail detail       |
| `/home-interior/elevations`         | `SectionView` | `four-grid`   | Elevations + material board                  |

---

## Key Components

**Mental model:**
`data/projects.js` → read by → **pages** → which render → **components**.

The data file is the only thing you edit to change what the site _says_.
The pages wire routes to that data. The components handle everything
visual and interactive — spinning vinyls, the full-bleed overlay,
Escape-to-close, hover animations. Change copy or add a project? Data.
Change how something looks or behaves? A component.

| Component           | Role              | Notes                                                                                 |
| ------------------- | ----------------- | ------------------------------------------------------------------------------------- |
| `app/page.js`       | Home / shelf      | Renders 3 `<HomeProjectTile>`s, ordered by `projectOrder`                             |
| `HomeProjectTile`   | Thumbnail + vinyl | Vinyl slides up + tilts on hover (spring physics, `pointer-events-none`)              |
| `IntroView`         | Project entry     | Server component. Hero image + title + two corner `<VinylNavLink>`s (home + section1) |
| `SectionView`       | Section page      | Client component. Picks grid layout, renders tiles, manages full-bleed, binds Escape  |
| `FullBleed`         | Image overlay     | Inner helper. Two stacked `<Image>`s cross-fade between cover/contain                 |
| `VinylNavLink`      | Corner CTA        | Shared by intro + section. Accumulating spin — always rotates forward, never back     |
| `TopLeftNav`        | Top-left nav      | `HomeIcon` (Link `/`) + `BackIcon` (`router.back()`)                                  |
| `Vinyl`             | Decorative SVG    | Per-project color + size via props. Used inside HomeProjectTile and VinylNavLink      |
| `data/projects.js`  | Content           | Projects, sections, tiles. Exports `projectOrder`, `getProject`, `getSection`         |

---

## Data Layer

Everything the site shows lives in
[`data/projects.js`](bfoxinteriordesign/data/projects.js). No database,
no API, no CMS — just one object.

### Shape

```js
projects["office"] = {
  id, title, thumb, vinylColor,        // identity + hex for vinyl label
  intro: { image, alt },               // hero image on the IntroView
  sections: [                          // order = prev/next flow order
    {
      slug, title,
      layout: "three-panel",           // three-panel | four-grid | six-grid
      tiles: [
        { image, alt, caption, fit }   // fit: "contain" opts out of crop
      ]
    }
  ]
};
```

### Exports

- `projectOrder` — home-shelf thumbnail order
- `getProject(slug)` — lookup a project
- `getSection(projectSlug, sectionSlug)` — returns the section + its
  `prev` / `next` neighbors, so navigation stays data-driven

---

## Scope

**In scope:**

- Home screen with three project entry points on a wood-texture shelf
- Three projects, each with three linear sections of image content
- Record-out-of-sleeve peek-up animation on home thumbnails
- Accumulating-spin corner vinyl CTAs for prev/next navigation
- Tile hover zoom-in and click-to-full-bleed interactions on all images
- Fit/Fill toggle inside the full-bleed overlay
- Escape-key dismissal of full-bleed overlay
- Per-tile `fit: "contain"` override for awkwardly-cropped imagery
- Three grid layout presets driven by data (`three-panel`, `four-grid`,
  `six-grid`)
- Responsive fluid sizing via `clamp()` and `next/image` `sizes` hints
- Static content via local data file — no backend
- Deployed publicly on Vercel

**Out of scope:**

- CMS or admin dashboard for content editing
- Contact form or resume download
- Backend, authentication, or database
- `prefers-reduced-motion` guard on hover animations _(tracked as TODO)_
- Focus trap inside full-bleed overlay _(tracked as `?` in SectionView)_
- Accessibility audit beyond semantic HTML basics + aria-label coverage

---

## Comment Structure

**Readability in Action:**

$\color{green}{\textsf{This is a highlighted/important comment}}$

$\color{red}{\textsf{! This is an alert or warning}}$

$\color{#3b82f6}{\textsf{? This is a question or something to revisit}}$

$\color{orange}{\textsf{TODO: Respect prefers-reduced-motion on the vinyl hovers}}$

~~// This is struck-through / deprecated~~