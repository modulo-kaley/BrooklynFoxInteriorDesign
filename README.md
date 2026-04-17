# Brooklyn Fox Interior Design

A portfolio website for **Brooklyn Fox**, Interior Designer — designed by
**Grace Wolff**, Information Designer, and built by **Kaley Wood**.

Rather than a conventional scrolling portfolio, this site functions as a
guided visual journey: users land on a home screen, select one of three
completed interior design projects, and move through a linear sequence of
curated images. Every image offers a hover-zoom interaction for a more
immersive experience.

---

## Features

- **Home Screen** — Wood-texture background with a floating vinyl record
  element and three project thumbnails displayed on a shelf
- **Project Entry** — Each project opens to its first section with a
  persistent back-to-home icon
- **Linear Section Navigation** — Sections progress in a fixed order per
  project with forward/back controls; no free-jumping between sections
- **Hover Zoom-In** — CSS scale transform on hover for all image tiles
  with a smooth transition
- **Full-Bleed Image View** — Click any image to open a full-viewport
  overlay with a floating white text card displaying the project description
- **Persistent Vinyl Element** — Decorative floating vinyl record rendered
  consistently across all views, repositioned per screen layout
- **Responsive Layout** — Mobile-first CSS; image grids collapse to a
  single column on small screens

---

## Tech Stack

| Category         | Technology                                |
| ---------------- | ----------------------------------------- |
| Framework        | Next.js (App Router)                      |
| Styling          | Tailwind CSS                              |
| Animation        | Framer Motion                             |
| Image Handling   | next/image                                |
| Content          | Local data file (`/src/data/projects.js`) |
| Deployment       | Vercel                                    |
| Version Control  | GitHub                                    |
| Design Reference | Figma prototype                           |

---

## Project Structure

The app uses Next.js App Router with a nested route structure that mirrors
the linear project flow.

| Route                               | Component       | Description                          |
| ----------------------------------- | --------------- | ------------------------------------ |
| `/`                                 | `HomePage`      | Hero: wood bg, vinyl, 3 thumbnails   |
| `/office`                           | `ProjectLayout` | Office entry; redirects to section 1 |
| `/office/concept-imagery`           | `SectionPage`   | 3-panel concept image grid           |
| `/office/context-planning`          | `SectionPage`   | 2x2 render grid, hover + full-bleed  |
| `/office/construction`              | `SectionPage`   | Plans, boards, sketches, drawings    |
| `/cafe`                             | `ProjectLayout` | Cafe entry; redirects to section 1   |
| `/cafe/floor-plans`                 | `SectionPage`   | Floor plan imagery grid              |
| `/cafe/context-planning`            | `SectionPage`   | Context and planning renders         |
| `/cafe/construction`                | `SectionPage`   | Construction documentation imagery   |
| `/home-interior`                    | `ProjectLayout` | Home entry; redirects to section 1   |
| `/home-interior/floors`             | `SectionPage`   | Flooring imagery grid                |
| `/home-interior/stair-construction` | `SectionPage`   | Stair construction imagery           |
| `/home-interior/elevations`         | `SectionPage`   | Elevation drawings and renders       |

---

## Key Components

- **`HomePage`** — Hero layout, wood background, vinyl float,
  `ProjectShelf` with 3 thumbnail entries
- **`ProjectLayout`** — Wraps a project's sections; provides home icon nav,
  section order config, and linear prev/next controls
- **`SectionPage`** — Generic section renderer; accepts an `images` array
  and section title from the project data file
- **`ImageGrid`** — Displays image tiles with hover zoom-in; passes click
  events up to trigger full-bleed view
- **`FullBleedView`** — Full-viewport overlay; displays selected image with
  floating description card; dismisses on click-outside or back
- **`VinylElement`** — Absolutely positioned decorative element;
  repositioned per layout via props

---

## Data Layer

All project and section content lives in `/src/data/projects.js`. Each
project entry defines its ordered sections, image paths, and any
description text shown in the full-bleed card. No database or external API
is required.

---

## Scope

**In scope:**

- Home screen with three individual project entry points
- Three projects, each with three linear sections of image content
- Hover zoom-in and click-to-full-bleed interactions on all images
- Persistent vinyl record decorative element across all views
- Responsive layout (mobile and desktop)
- Static content via local data file
- Deployed publicly on Vercel

**Out of scope:**

- CMS or admin dashboard for content editing
- Contact form or resume download
- Backend, authentication, or database
- Accessibility audit beyond semantic HTML basics

---

## Design Reference

The UI is anchored to a high-fidelity Figma prototype designed by Grace
Wolff, based on Brooklyn Fox's design direction.

[View Interactive Prototype](https://www.figma.com/proto/wjcQR6U0GRy1YYmSWrIF65/Untitled?page-id=0%3A1&node-id=1-3&p=f&viewport=545%2C475%2C0.31&t=HeLQzvrsBWOLQLxv-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=1%3A3)

---

## Development Experiment

This project doubles as a **human vs. AI development experiment**. Starting
from the same initialized codebase and shared project spec, the site is
built in parallel across two branches:

| Branch          | Developer          | Approach                                                               |
| --------------- | ------------------ | ---------------------------------------------------------------------- |
| `kaley-branch`  | Kaley Wood         | Built by hand — intuition, iteration, and lived coding experience      |
| `claude-branch` | Claude (Anthropic) | Driven by an `AGENTS.md` file — agentic, instruction-based development |

Both branches start from the same base folder structure and work toward the
same Figma prototype. Neither has visibility into the other during
development.

### Purpose

The goal is to compare the process and outcomes of human-led vs.
AI-agent-led frontend development on a real, non-trivial project. After
both branches reach completion, Kaley will write a reflection and analysis
covering:

- Where each approach excelled or struggled
- Differences in code structure, decision-making, and output quality
- What it felt like to build vs. direct
- What this reveals about human-AI collaboration in dev work

---

## Credits

- **Interior Designer** — Brooklyn Fox
- **Information Designer** — Grace Wolff
- **Developer** — Kaley Wood
