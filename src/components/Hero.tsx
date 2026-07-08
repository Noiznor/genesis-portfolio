import Link from "next/link";
import { InteractiveTerminal } from "@/components/InteractiveTerminal";
import { SmoothScrollLink } from "@/components/SmoothScrollLink";
import type { SiteProfile } from "@/lib/portfolio-data";
import type { Achievement, Certification, Experience, Project, SkillCategory } from "@/types";

type HeroProps = {
  siteProfile: SiteProfile;
  projects: Project[];
  skillCategories: SkillCategory[];
  experiences: Experience[];
  achievements: Achievement[];
  certifications: Certification[];
};

const techTags = [
  "CAN Bus",
  "AGL",
  "Cybersecurity",
  "AI/ML",
  "Raspberry Pi",
  "Embedded Systems",
  "Robotics"
];

export function Hero({
  siteProfile,
  projects,
  skillCategories,
  experiences,
  achievements,
  certifications
}: HeroProps) {
  return (
    <section
      id="home"
      className="relative mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl items-center gap-12 px-6 py-24 lg:grid-cols-[1.05fr_0.95fr]"
    >
      <div>
        <p className="mb-5 text-sm font-semibold uppercase tracking-[0.35em] text-emerald-300">
          {siteProfile.heroEyebrow}
        </p>

        <h1 className="max-w-4xl text-5xl font-bold tracking-tight text-slate-50 drop-shadow-[0_0_20px_rgba(34,197,94,0.12)] sm:text-6xl lg:text-7xl">
          {siteProfile.heroTitle}
        </h1>

        <p className="mt-6 max-w-3xl text-lg font-semibold leading-8 text-emerald-300">
          {siteProfile.heroSubtitle}
        </p>

        <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300">
          {siteProfile.heroDescription}
        </p>

        <div className="mt-9 flex flex-wrap gap-4">
          <SmoothScrollLink
            href="#projects"
            className="rounded-xl bg-emerald-400 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/25 transition hover:-translate-y-0.5 hover:bg-emerald-300"
          >
            View Projects →
          </SmoothScrollLink>

          <Link
            href={siteProfile.resumePath}
            className="rounded-xl border border-emerald-400/25 bg-slate-950/70 px-6 py-3 text-sm font-bold text-slate-100 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:text-emerald-200"
          >
            Download Resume ↓
          </Link>

          <SmoothScrollLink
            href="#contact"
            className="rounded-xl px-6 py-3 text-sm font-bold text-slate-300 transition hover:text-emerald-200"
          >
            Contact Me ✉
          </SmoothScrollLink>
        </div>

        <div className="mt-10 flex max-w-2xl flex-wrap gap-3">
          {techTags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-emerald-400/20 bg-emerald-400/5 px-4 py-2 text-xs font-medium text-emerald-100 shadow-sm shadow-emerald-500/10"
            >
              <span className="mr-2 text-emerald-300">~/</span>
              {tag}
            </span>
          ))}
        </div>
      </div>

      <InteractiveTerminal
        siteProfile={siteProfile}
        projects={projects}
        skillCategories={skillCategories}
        experiences={experiences}
        achievements={achievements}
        certifications={certifications}
        links={{
          personalGithub: siteProfile.personalGithub,
          sphrGithub: siteProfile.sphrGithub
        }}
      />
    </section>
  );
}
