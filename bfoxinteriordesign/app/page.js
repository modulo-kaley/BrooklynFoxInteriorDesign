import Image from "next/image";
import { projects, projectOrder } from "../data/projects";
import HomeProjectTile from "../components/HomeProjectTile";

// The home screen. Three project thumbnails sit on a wooden shelf with
// "BROOKLYN FOX — Interior Designer" below them. The left-to-right order
// of the thumbnails comes from projectOrder in the data file, so if I
// ever want to shuffle them, I just reorder that list — not this file.
export default function Home() {
  return (
    <div className="min-h-screen wood-surface relative overflow-hidden flex flex-col items-center justify-center px-8 py-16">
      <div className="relative flex flex-col items-center w-full max-w-[1565px]">
        <div className="flex items-end gap-9 mb-2 relative z-10">
          {projectOrder.map((slug) => (
            <HomeProjectTile key={slug} slug={slug} project={projects[slug]} />
          ))}
        </div>

        <div className="relative w-full h-[clamp(40px,5vw,62px)] -mt-2">
          <Image
            src="/images/home/shelf.png"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>

        <h1 className="mt-10 text-white font-bold tracking-tight text-center text-[clamp(64px,10vw,144px)] leading-none drop-shadow-[0_6px_14px_rgba(0,0,0,0.5)]">
          BROOKLYN FOX
        </h1>
        <p className="mt-6 text-white font-bold text-[clamp(28px,4.5vw,72px)] leading-none text-center drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
          Interior Designer
        </p>
      </div>
    </div>
  );
}
