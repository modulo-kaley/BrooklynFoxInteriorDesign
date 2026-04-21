import { notFound } from "next/navigation";
import { getSection, projects, projectOrder } from "../../../data/projects";
import SectionView from "../../../components/SectionView";

// Walks every album × every section (3 × 3 = 9 pages) and hands the list
// to Next so it can build all of them as static HTML. Clicking between
// sections feels instant because nothing has to load on the fly.
// (Segment names: "album" = a project, "track" = a section — the vinyl
// metaphor carried into the URL structure.)
export function generateStaticParams() {
  const params = [];
  for (const projectSlug of projectOrder) {
    for (const section of projects[projectSlug].sections) {
      params.push({ album: projectSlug, track: section.slug });
    }
  }
  return params;
}

// The /[album]/[track] route. getSection does the heavy lifting of figuring
// out which section comes before and after this one, so SectionView doesn't
// have to re-walk the section list just to draw the arrows.
export default async function SectionPage({ params }) {
  const { album: projectSlug, track: sectionSlug } = await params;
  const result = getSection(projectSlug, sectionSlug);
  if (!result) notFound();
  const { project, section, prev, next } = result;
  return <SectionView project={project} section={section} prev={prev} next={next} />;
}
