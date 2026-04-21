// Everything the portfolio shows — every page, image grid, and arrow button —
// pulls from this one file. No CMS, no API, no database. Just an object.
//
// Each project is shaped like this:
//   projects[slug] = {
//     id, title, thumb, vinylColor,
//     intro: { image, alt },
//     sections: [{ slug, title, layout, tiles: [{ image, alt, caption }] }]
//   }
//
// Adding a new project? Drop it in below and add its slug to projectOrder.
// Adding a section? Push it onto that project's sections array — order
// matters here, it's what the prev/next arrows walk through.
//
// ! Heads up: layout has to be "three-panel", "four-grid", or "six-grid".
// Those strings have to match the keys in components/SectionView.js →
// layoutClasses. Anything else quietly falls back to three-panel.
export const projects = {
  office: {
    id: "office",
    title: "Office Interior",
    thumb: "/images/home/thumb-office.png",
    vinylColor: "#C97B3C",
    intro: {
      image: "/images/office/office-interior-reception-desk.jpg",
      alt: "Office reception desk interior",
    },
    sections: [
      {
        slug: "concept-imagery",
        title: "Concept Imagery",
        layout: "three-panel",
        tiles: [
          {
            image: "/images/office/concept-imagery-one.jpg",
            alt: "Infinite corridor concept",
            caption:
              "Dynamic and fluid space inspired by the rhythm of collaboration and the harmony of creativity. Like a symphony, each individual is a unique note, and VibeLink is the staff that holds them together striking a balance between structure and flexibility.",
          },
          {
            image: "/images/office/concept-imagery-two.jpg",
            alt: "Flowing wave concept",
            caption:
              "Dynamic and fluid space inspired by the rhythm of collaboration and the harmony of creativity. Like a symphony, each individual is a unique note, and VibeLink is the staff that holds them together striking a balance between structure and flexibility.",
          },
          {
            image: "/images/office/concept-imager-three.jpg",
            alt: "Vinyl record concept",
            caption:
              "Dynamic and fluid space inspired by the rhythm of collaboration and the harmony of creativity. Like a symphony, each individual is a unique note, and VibeLink is the staff that holds them together striking a balance between structure and flexibility.",
          },
        ],
      },
      {
        slug: "context-planning",
        title: "Context and Planning",
        layout: "four-grid",
        tiles: [
          {
            image: "/images/office/context-planning-lunch-area.jpg",
            alt: "Lunch area render",
            caption: "Lunch and informal gathering area.",
          },
          {
            image: "/images/office/context-planning-kitchen-meeting.jpg",
            alt: "Kitchen and meeting area",
            caption: "Shared kitchen anchoring a meeting zone.",
          },
          {
            image: "/images/office/context-planning-conference-backview.jpg",
            alt: "Conference room back view",
            caption: "Conference room viewed from rear of floor plate.",
          },
          {
            image: "/images/office/context-planning-kitchen-hallway.jpg",
            alt: "Kitchen hallway",
            caption: "Transition between kitchen and workspace hallway.",
          },
        ],
      },
      {
        slug: "construction",
        title: "Construction",
        layout: "six-grid",
        tiles: [
          {
            image: "/images/office/construction-coffeebar-combined.jpg",
            alt: "Coffee bar combined view",
            caption: "Coffee bar — combined plan and elevation.",
          },
          {
            image: "/images/office/construction-recep-line-rendering.jpg",
            alt: "Reception line rendering",
            caption: "Reception line rendering.",
          },
          {
            image: "/images/office/construction-pony-wall.jpg",
            alt: "Pony wall detail",
            caption: "Pony wall framing detail.",
          },
          {
            image: "/images/office/construction-materials.png",
            alt: "Material board",
            caption: "Material board for office finishes.",
          },
          {
            image: "/images/office/construction-Infoma-collab.jpg",
            alt: "Collaboration space rendering",
            caption: "Informal collaboration space rendering.",
          },
        ],
      },
    ],
  },

  cafe: {
    id: "cafe",
    title: "Cafe Interior",
    thumb: "/images/home/thumb-cafe.png",
    vinylColor: "#6E1E2C",
    intro: {
      image: "/images/cafe/cafe-interior-frontview-counter.jpg",
      alt: "Cafe interior front view",
    },
    sections: [
      {
        slug: "floor-plans",
        title: "Floor Plans",
        layout: "three-panel",
        tiles: [
          {
            image: "/images/cafe/floor-plans-one.png",
            alt: "Floor plan concept one",
            caption:
              "A layered intersection of past and present. The café unites history and innovation into a contemporary expression of place and belonging.",
          },
          {
            image: "/images/cafe/floor-plans-two.png",
            alt: "Floor plan concept two",
            caption:
              "A layered intersection of past and present. The café unites history and innovation into a contemporary expression of place and belonging.",
          },
          {
            image: "/images/cafe/floor-plans-three.png",
            alt: "Floor plan concept three",
            caption:
              "A layered intersection of past and present. The café unites history and innovation into a contemporary expression of place and belonging.",
          },
        ],
      },
      {
        slug: "context-planning",
        title: "Context and Planning",
        layout: "six-grid",
        // Order matters — the six-grid lays out 3 across per row, so with
        // 5 tiles we get 3 on top and 2 centered below. Bubble diagrams
        // (the planning step) go on top in numeric order, and the two
        // photographed renders (the realized concept) sit beneath them.
        tiles: [
          {
            image: "/images/cafe/context-planning-one.jpg",
            alt: "Context render one",
            caption: "Seating area concept with banquette.",
          },
          {
            image: "/images/cafe/context-planning-two.jpg",
            alt: "Context render two",
            caption: "Daytime activity plan overlay.",
            // Bubble diagram extends beyond a square — crop eats the
            // outer clusters, so show the whole thing.
            fit: "contain",
          },
          {
            image: "/images/cafe/context-planning-three.jpg",
            alt: "Context render three",
            caption: "Secondary seating and circulation.",
          },
          {
            image: "/images/cafe/context-planning-cafe-frontvierw-counter.jpg",
            alt: "Front view of counter",
            caption: "Front view of cafe counter.",
            // Tried fit: "contain" here, but letterboxing a wide photo
            // into a square left big white bars above and below that
            // read as broken. The counter and figures are centered in
            // the frame, so a cover-crop only trims ceiling/floor —
            // click opens the full image anyway.
          },
          {
            image: "/images/cafe/context-planning-cafe-sofa.png",
            alt: "Cafe sofa concept",
            caption: "Lounge corner with sofa.",
          },
        ],
      },
      {
        slug: "construction",
        title: "Construction",
        layout: "six-grid",
        tiles: [
          {
            image: "/images/cafe/construction-plan-render.jpg",
            alt: "Plan render",
            caption: "Overall plan render.",
          },
          {
            image: "/images/cafe/construction-mainfloor-blocking.png",
            alt: "Main floor blocking",
            caption: "Main floor blocking diagram.",
          },
          {
            image: "/images/cafe/construction-sectional-render.jpg",
            alt: "Sectional render",
            caption: "Sectional render through counter.",
          },
          {
            image: "/images/cafe/construction-materials.png",
            alt: "Material board",
            caption: "Material selections.",
          },
          {
            image: "/images/cafe/construction-furniture.png",
            alt: "Furniture board",
            caption: "Furniture selections.",
          },
          {
            image: "/images/cafe/construction-better-banquette.jpg",
            alt: "Banquette rendering",
            caption: "Banquette and final buildout render.",
          },
        ],
      },
    ],
  },

  "home-interior": {
    id: "home-interior",
    title: "Home Interior",
    thumb: "/images/home/thumb-home.png",
    vinylColor: "#3E5F8A",
    intro: {
      image: "/images/home-interior/home-interior-stairs.png",
      alt: "Home interior stairs",
    },
    sections: [
      {
        slug: "floors",
        title: "Floors",
        layout: "three-panel",
        tiles: [
          {
            image: "/images/home/floors-basement.png",
            alt: "Basement floor plan",
            caption: "Basement level floor plan.",
          },
          {
            image: "/images/home/floors-map.png",
            alt: "Upper floor plan",
            caption: "Upper floor plan.",
          },
          {
            image: "/images/home/floors-raw.png",
            alt: "Main floor map",
            caption: "Main floor color-coded plan.",
          },
        ],
      },
      {
        slug: "stair-construction",
        title: "Stair Construction",
        layout: "three-panel",
        tiles: [
          {
            image: "/images/home/construction-north-west-section.png",
            alt: "North-west section drawing",
            caption: "North-west stair section drawing.",
          },
          {
            image: "/images/home-interior/home-interior-stairs.png",
            alt: "Stair render",
            caption: "Finished stair render.",
          },
          {
            image: "/images/home/construction-handrail.png",
            alt: "Handrail detail",
            caption: "Handrail profile detail.",
          },
        ],
      },
      {
        slug: "elevations",
        title: "Elevations",
        layout: "four-grid",
        tiles: [
          {
            image: "/images/home/elevations-one.png",
            alt: "Elevation drawing one",
            caption: "Bedroom elevation.",
          },
          {
            image: "/images/home/elevations-two.png",
            alt: "Elevation drawing two",
            caption: "Living room elevation.",
          },
          {
            image: "/images/home/elevations-three.png",
            alt: "Elevation drawing three",
            caption: "Bath and closet elevation.",
          },
          {
            image: "/images/home/elevations-material-board.png",
            alt: "Material board",
            caption: "Material and finish board.",
          },
        ],
      },
    ],
  },
};

// Sets the left-to-right order of the thumbnails on the home page.
// Kept separate from the projects object so I can rearrange what the viewer
// sees first without digging through the actual content.
export const projectOrder = ["office", "cafe", "home-interior"];

export function getProject(slug) {
  return projects[slug];
}

// Looks up a section by its project + section slug, and figures out its
// prev/next neighbors in the same step. That way SectionView doesn't have
// to know anything about ordering — it just gets what it needs.
// Returns null if either slug doesn't exist, so the page can fall through
// to a 404.
export function getSection(projectSlug, sectionSlug) {
  const project = projects[projectSlug];
  if (!project) return null;
  const index = project.sections.findIndex((s) => s.slug === sectionSlug);
  if (index === -1) return null;
  return {
    project,
    section: project.sections[index],
    index,
    prev: index > 0 ? project.sections[index - 1] : null,
    next: index < project.sections.length - 1 ? project.sections[index + 1] : null,
  };
}
