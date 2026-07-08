import type { SkillCategory } from "@/types";

type SkillsProps = {
  skillCategories: SkillCategory[];
};

export function Skills({ skillCategories }: SkillsProps) {
  return (
    <section id="skills" className="mx-auto max-w-7xl px-6 py-20">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">
        Skills
      </p>

      <h2 className="mt-3 text-3xl font-bold text-slate-50">
        Technical skill areas
      </h2>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {skillCategories.map((category) => (
          <div
            key={category.id}
            className="rounded-2xl border border-emerald-400/10 bg-slate-950/75 p-6 shadow-lg shadow-emerald-500/5 transition hover:-translate-y-1 hover:border-emerald-400/35 hover:bg-emerald-400/[0.03]"
          >
            <h3 className="text-xl font-semibold text-slate-100">
              {category.title}
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              {category.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {category.skills.map((skill) => (
                <span
                  key={skill.name}
                  className="rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1 text-xs text-emerald-100"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
