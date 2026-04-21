import Image from "next/image";
import Link from "next/link";
import { TopLeftNav } from "./NavIcons";
import VinylNavLink from "./VinylNavLink";

// The entry screen for a project — hero image, title, and a "next" link in
// the corner. No clicks to manage, no state, so this stays a server
// component. Both the hero image and the bottom-right link go to the same
// place: the project's first section. Each project has its own vinyl color
// so you can tell them apart at a glance.
export default function IntroView({ project, firstSection }) {
  return (
    <div className="h-screen wood-surface relative overflow-hidden">
      <TopLeftNav />

      <main className="h-full flex flex-col items-center justify-center px-8 py-20 gap-8">
        <Link
          href={`/${project.id}/${firstSection.slug}`}
          className="block shadow-[0_14px_30px_rgba(0,0,0,0.55)] relative aspect-3/2 h-[min(60vh,600px)] max-w-full overflow-hidden tile-hover"
          aria-label={`Enter ${project.title}`}
        >
          <Image
            src={project.intro.image}
            alt={project.intro.alt}
            fill
            sizes="(max-width: 768px) 90vw, 900px"
            className="object-cover"
            quality={90}
            priority
          />
        </Link>

        <h1 className="text-white text-4xl md:text-5xl font-bold tracking-tight text-center drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
          {project.title}
        </h1>
      </main>

      {/*
        Left-corner vinyl back to the home shelf. The top-left home icon
        also goes there, but that's a small glyph that's easy to miss —
        the vinyl gives you the same "this is how you back out" affordance
        that every section page has, so the project intro doesn't feel
        like a dead end.
      */}
      <VinylNavLink
        href="/"
        label="Home"
        color={project.vinylColor}
        direction="prev"
        ariaLabel="Back to home"
      />

      <VinylNavLink
        href={`/${project.id}/${firstSection.slug}`}
        label={firstSection.title}
        color={project.vinylColor}
        direction="next"
        ariaLabel={`Enter ${firstSection.title}`}
      />
    </div>
  );
}
