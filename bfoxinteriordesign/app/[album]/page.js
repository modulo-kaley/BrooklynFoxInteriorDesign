import { notFound } from "next/navigation";
import { getProject, projectOrder } from "../../data/projects";
import IntroView from "../../components/IntroView";

// Hands Next the list of album slugs so it can bake each intro page into
// plain HTML at build time. /office, /cafe, and /home-interior all ship
// pre-rendered — nothing has to load when someone visits.
export function generateStaticParams() {
  return projectOrder.map((album) => ({ album }));
}

// The /[album] route (so /office, /cafe, /home-interior). This is a server
// component, so it can fetch the project data directly and pass it to the view.
export default async function ProjectIntroPage({ params }) {
  const { album: projectSlug } = await params;
  const project = getProject(projectSlug);
  if (!project) notFound();
  
  // The "start" link on the intro screen points at whatever section comes
  // first in the data file — so section order is decided there, not here.
  const firstSection = project.sections[0];
  return <IntroView project={project} firstSection={firstSection} />;
}
