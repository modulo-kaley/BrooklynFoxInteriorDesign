export const projects = [
  {
    slug: "office",
    title: "Office",
    thumbnail: "/images/office/thumb.jpg",
    sections: [
      {
        slug: "concept-imagery",
        title: "Concept Imagery",
        description:
          "A curated collection of concept images that established the visual language for this office interior — warm materials, natural light, and considered spatial flow.",
        layout: "three-panel",
        images: [
          { src: "/images/office/concept-1.jpg", alt: "Office concept image 1 — material and colour palette" },
          { src: "/images/office/concept-2.jpg", alt: "Office concept image 2 — lighting and spatial reference" },
          { src: "/images/office/concept-3.jpg", alt: "Office concept image 3 — furniture and layout inspiration" },
        ],
      },
      {
        slug: "context-planning",
        title: "Context Planning",
        description:
          "Contextual plans showing how the office layout responds to its surroundings — adjacencies, circulation paths, and daylight strategy.",
        layout: "two-by-two",
        images: [
          { src: "/images/office/context-1.jpg", alt: "Office context plan 1 — floor layout overview" },
          { src: "/images/office/context-2.jpg", alt: "Office context plan 2 — circulation diagram" },
          { src: "/images/office/context-3.jpg", alt: "Office context plan 3 — daylight analysis" },
          { src: "/images/office/context-4.jpg", alt: "Office context plan 4 — adjacency study" },
        ],
      },
      {
        slug: "construction",
        title: "Construction",
        description:
          "Construction documentation and site photography capturing the build process as the design comes to life.",
        layout: "mixed",
        images: [
          { src: "/images/office/construction-1.jpg", alt: "Office construction phase 1 — framing" },
          { src: "/images/office/construction-2.jpg", alt: "Office construction phase 2 — finishes" },
          { src: "/images/office/construction-3.jpg", alt: "Office construction phase 3 — completion" },
        ],
      },
    ],
  },
  {
    slug: "cafe",
    title: "Cafe",
    thumbnail: "/images/cafe/thumb.jpg",
    sections: [
      {
        slug: "floor-plans",
        title: "Floor Plans",
        description:
          "Detailed floor plans for the cafe space, balancing seating density with comfortable circulation and a welcoming atmosphere.",
        layout: "three-panel",
        images: [
          { src: "/images/cafe/floor-1.jpg", alt: "Cafe floor plan — ground level seating layout" },
          { src: "/images/cafe/floor-2.jpg", alt: "Cafe floor plan — service and kitchen zone" },
          { src: "/images/cafe/floor-3.jpg", alt: "Cafe floor plan — furniture arrangement detail" },
        ],
      },
      {
        slug: "context-planning",
        title: "Context Planning",
        description:
          "Context studies showing the cafe's relationship to the street, neighbouring uses, and pedestrian flow.",
        layout: "two-by-two",
        images: [
          { src: "/images/cafe/context-1.jpg", alt: "Cafe context plan 1 — street frontage" },
          { src: "/images/cafe/context-2.jpg", alt: "Cafe context plan 2 — pedestrian flow" },
          { src: "/images/cafe/context-3.jpg", alt: "Cafe context plan 3 — neighbouring uses" },
          { src: "/images/cafe/context-4.jpg", alt: "Cafe context plan 4 — access and entry points" },
        ],
      },
      {
        slug: "construction",
        title: "Construction",
        description:
          "Site photography documenting the cafe fitout from raw shell to finished interior.",
        layout: "mixed",
        images: [
          { src: "/images/cafe/construction-1.jpg", alt: "Cafe construction — base build" },
          { src: "/images/cafe/construction-2.jpg", alt: "Cafe construction — joinery installation" },
          { src: "/images/cafe/construction-3.jpg", alt: "Cafe construction — final fit-out" },
        ],
      },
    ],
  },
  {
    slug: "home-interior",
    title: "Home Interior",
    thumbnail: "/images/home-interior/thumb.jpg",
    sections: [
      {
        slug: "floors",
        title: "Floors",
        description:
          "Flooring selections and installation documentation — hardwood, tile, and material transitions thoughtfully coordinated across the home.",
        layout: "three-panel",
        images: [
          { src: "/images/home-interior/floors-1.jpg", alt: "Home interior floors — hardwood living area" },
          { src: "/images/home-interior/floors-2.jpg", alt: "Home interior floors — tile in wet areas" },
          { src: "/images/home-interior/floors-3.jpg", alt: "Home interior floors — material transition detail" },
        ],
      },
      {
        slug: "stair-construction",
        title: "Stair Construction",
        description:
          "Custom stair design and construction — a sculptural centrepiece connecting the home's levels with careful attention to proportion and detail.",
        layout: "three-panel",
        images: [
          { src: "/images/home-interior/stair-1.jpg", alt: "Home interior stair — structural frame" },
          { src: "/images/home-interior/stair-2.jpg", alt: "Home interior stair — tread and riser detail" },
          { src: "/images/home-interior/stair-3.jpg", alt: "Home interior stair — completed installation" },
        ],
      },
      {
        slug: "elevations",
        title: "Elevations",
        description:
          "Interior elevations showing wall treatments, joinery heights, and the vertical composition of each key space.",
        layout: "three-panel",
        images: [
          { src: "/images/home-interior/elevations-1.jpg", alt: "Home interior elevation — living room feature wall" },
          { src: "/images/home-interior/elevations-2.jpg", alt: "Home interior elevation — kitchen joinery" },
          { src: "/images/home-interior/elevations-3.jpg", alt: "Home interior elevation — bedroom built-ins" },
        ],
      },
    ],
  },
];

/**
 * Get a project by slug.
 * @param {string} slug
 */
export function getProject(slug) {
  return projects.find((p) => p.slug === slug) ?? null;
}

/**
 * Get a section by project slug + section slug.
 * @param {string} projectSlug
 * @param {string} sectionSlug
 */
export function getSection(projectSlug, sectionSlug) {
  const project = getProject(projectSlug);
  if (!project) return null;
  return project.sections.find((s) => s.slug === sectionSlug) ?? null;
}
