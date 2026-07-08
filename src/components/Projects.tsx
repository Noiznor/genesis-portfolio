"use client";

import Link from "next/link";
import { KeyboardEvent, useState } from "react";
import { DetailModal } from "@/components/DetailModal";
import type { Project } from "@/types";

type ProjectsProps = {
  projects: Project[];
};

function ProjectImage({
  imageUrl,
  title
}: {
  imageUrl?: string;
  title: string;
}) {
  if (imageUrl) {
    return (
      <div className="h-52 overflow-hidden border-b border-emerald-400/10 bg-slate-900/70">
        <img
          src={imageUrl}
          alt={`${title} featured image`}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
    );
  }

  return (
    <div className="flex h-52 items-center justify-center border-b border-emerald-400/10 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.16),transparent_55%)]">
      <div className="rounded-2xl border border-emerald-400/20 bg-slate-950/80 px-6 py-5 text-center shadow-lg shadow-emerald-500/10">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-emerald-300">
          Project Image
        </p>
        <p className="mt-2 text-sm text-slate-400">
          Add URL in sudo edit
        </p>
      </div>
    </div>
  );
}

export function Projects({ projects }: ProjectsProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  function openProject(project: Project) {
    setSelectedProject(project);
  }

  function handleCardKeyDown(event: KeyboardEvent<HTMLElement>, project: Project) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openProject(project);
    }
  }

  return (
    <section id="projects" className="mx-auto max-w-7xl px-6 py-20">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">
        Projects
      </p>

      <h2 className="mt-3 text-3xl font-bold text-slate-50">
        Featured engineering projects
      </h2>

      <p className="mt-4 max-w-3xl leading-7 text-slate-400">
        Practical projects across automotive Linux, CAN bus analysis, cybersecurity,
        AI edge intelligence, embedded systems, and software-hardware integration.
      </p>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {projects.map((project) => (
          <article
            key={project.id}
            role="button"
            tabIndex={0}
            onClick={() => openProject(project)}
            onKeyDown={(event) => handleCardKeyDown(event, project)}
            className="group cursor-pointer overflow-hidden rounded-2xl border border-emerald-400/10 bg-slate-950/75 shadow-lg shadow-emerald-500/5 outline-none transition hover:-translate-y-1 hover:border-emerald-400/35 hover:bg-emerald-400/[0.03] hover:shadow-emerald-500/15 focus-visible:border-emerald-300 focus-visible:ring-2 focus-visible:ring-emerald-300/40"
          >
            <ProjectImage imageUrl={project.featuredImageUrl} title={project.title} />

            <div className="p-6">
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-lime-300">
                {project.category}
              </p>

              <h3 className="mt-3 text-xl font-semibold text-slate-100 transition group-hover:text-emerald-200">
                {project.title}
              </h3>

              <p className="mt-4 text-sm leading-6 text-slate-400">
                {project.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {project.techStack.slice(0, 6).map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-emerald-400/15 bg-emerald-400/5 px-3 py-1 text-xs text-emerald-100"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                {project.links.map((link) => (
                  <Link
                    key={`${project.id}-${link.label}`}
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                    onClick={(event) => {
                      event.stopPropagation();

                      if (link.isPlaceholder || link.href === "#") {
                        event.preventDefault();
                      }
                    }}
                    onKeyDown={(event) => {
                      event.stopPropagation();
                    }}
                    className={`rounded-full border px-4 py-2 text-xs font-bold transition ${
                      link.isPlaceholder || link.href === "#"
                        ? "cursor-not-allowed border-slate-700 text-slate-500"
                        : "border-emerald-400/25 text-emerald-200 hover:border-emerald-300 hover:bg-emerald-400/10"
                    }`}
                    aria-disabled={link.isPlaceholder || link.href === "#"}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      <DetailModal
        isOpen={selectedProject !== null}
        title={selectedProject?.title ?? ""}
        eyebrow={selectedProject?.category}
        onClose={() => setSelectedProject(null)}
      >
        {selectedProject ? (
          <div className="space-y-8">
            {selectedProject.featuredImageUrl ? (
              <div className="overflow-hidden rounded-2xl border border-emerald-400/15 bg-slate-950">
                <img
                  src={selectedProject.featuredImageUrl}
                  alt={`${selectedProject.title} featured image`}
                  className="max-h-[420px] w-full object-cover"
                />
              </div>
            ) : null}

            <div>
              <h3 className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-emerald-300">
                Project Overview
              </h3>
              <p className="mt-3 leading-7 text-slate-300">
                {selectedProject.overview}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-emerald-400/10 bg-emerald-400/5 p-5">
                <h4 className="font-semibold text-slate-100">Problem Solved</h4>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {selectedProject.problemSolved}
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-400/10 bg-emerald-400/5 p-5">
                <h4 className="font-semibold text-slate-100">My Role</h4>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {selectedProject.role}
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-100">Key Highlights</h4>
              <ul className="mt-4 grid gap-3 md:grid-cols-2">
                {selectedProject.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-slate-300"
                  >
                    <span className="mr-2 text-emerald-300">▸</span>
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-slate-100">Technical Work</h4>
              <ul className="mt-4 space-y-3">
                {selectedProject.technicalWork.map((item) => (
                  <li key={item} className="text-sm leading-6 text-slate-300">
                    <span className="mr-2 text-emerald-300">$</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-slate-100">Tools Used</h4>
              <div className="mt-4 flex flex-wrap gap-2">
                {selectedProject.toolsUsed.map((tool) => (
                  <span
                    key={tool}
                    className="rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1 text-xs text-emerald-100"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-400/15 bg-slate-950/80 p-5">
              <h4 className="font-semibold text-slate-100">
                Result / Learning Outcome
              </h4>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                {selectedProject.result}
              </p>
            </div>
          </div>
        ) : null}
      </DetailModal>
    </section>
  );
}
