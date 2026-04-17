"use client";

import { useState } from "react";
import Link from "next/link";
import { getProject } from "@/data/projects";
import ProjectLayout from "@/components/ProjectLayout";
import ImageGrid from "@/components/ImageGrid";
import FullBleedView from "@/components/FullBleedView";

export default function SectionPage({ projectSlug, sectionSlug }) {
  const [openImage, setOpenImage] = useState(null);

  const project = getProject(projectSlug);
  if (!project) {
    return (
      <ProjectLayout projectSlug={projectSlug}>
        <p>Project not found.</p>
      </ProjectLayout>
    );
  }

  const sectionIndex = project.sections.findIndex((s) => s.slug === sectionSlug);
  const section = project.sections[sectionIndex];

  if (!section) {
    return (
      <ProjectLayout projectSlug={projectSlug}>
        <p>Section not found.</p>
      </ProjectLayout>
    );
  }

  const prevSection = sectionIndex > 0 ? project.sections[sectionIndex - 1] : null;
  const nextSection =
    sectionIndex < project.sections.length - 1
      ? project.sections[sectionIndex + 1]
      : null;

  return (
    <ProjectLayout projectSlug={projectSlug}>
      {/* Section title */}
      <header className="mb-8">
        <p className="text-sm uppercase tracking-widest text-stone-400 mb-1">
          {project.title}
        </p>
        <h1 className="text-3xl font-semibold text-stone-800">{section.title}</h1>
      </header>

      {/* Image grid */}
      <ImageGrid
        images={section.images}
        layout={section.layout}
        onImageClick={(image) => setOpenImage(image)}
      />

      {/* Prev / next navigation */}
      <nav className="mt-12 flex justify-between border-t border-stone-200 pt-6">
        {prevSection ? (
          <Link
            href={`/${projectSlug}/${prevSection.slug}`}
            className="text-sm text-stone-600 hover:underline"
          >
            &larr; {prevSection.title}
          </Link>
        ) : (
          <span />
        )}

        {nextSection ? (
          <Link
            href={`/${projectSlug}/${nextSection.slug}`}
            className="text-sm text-stone-600 hover:underline"
          >
            {nextSection.title} &rarr;
          </Link>
        ) : (
          <span />
        )}
      </nav>

      {/* Full-bleed overlay */}
      {openImage && (
        <FullBleedView
          image={openImage}
          description={section.description}
          onClose={() => setOpenImage(null)}
        />
      )}
    </ProjectLayout>
  );
}
