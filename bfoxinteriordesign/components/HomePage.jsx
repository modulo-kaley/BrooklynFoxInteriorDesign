import Link from "next/link";
import Image from "next/image";
import VinylElement from "@/components/VinylElement";
import { projects } from "@/data/projects";

export default function HomePage() {
  return (
    <main
      className="relative min-h-screen w-full bg-[#8b5a2b] bg-cover bg-center"
      style={{ backgroundImage: "url(/images/wood-texture.jpg)" }}
    >
      {/* Floating vinyl decoration */}
      <VinylElement position="top-right" size="lg" />

      {/* Site header */}
      <div className="relative z-10 px-6 pt-16 pb-8 text-center sm:px-12">
        <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-lg sm:text-5xl">
          Brooklyn Fox
        </h1>
        <p className="mt-2 text-lg text-white/80 drop-shadow">
          Interior Design
        </p>
      </div>

      {/* Project shelf — 3 thumbnails */}
      <section className="relative z-10 mx-auto max-w-5xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/${project.slug}`}
              className="group block overflow-hidden rounded-xl shadow-xl transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden">
                <Image
                  src={project.thumbnail}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
                {/* Title overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h2 className="text-lg font-semibold text-white">
                    {project.title}
                  </h2>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
