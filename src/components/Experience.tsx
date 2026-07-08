import type { Experience as ExperienceType } from "@/types";

type ExperienceProps = {
  experiences: ExperienceType[];
};

export function Experience({ experiences }: ExperienceProps) {
  return (
    <section id="experience" className="mx-auto max-w-7xl px-6 py-20">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">
        Experience
      </p>

      <h2 className="mt-3 text-3xl font-bold text-slate-50">
        Experience and leadership
      </h2>

      <div className="mt-10 space-y-6">
        {experiences.map((item) => (
          <article
            key={item.id}
            className="rounded-2xl border border-emerald-400/10 bg-slate-950/75 p-6 shadow-lg shadow-emerald-500/5 transition hover:-translate-y-1 hover:border-emerald-400/35 hover:bg-emerald-400/[0.03]"
          >
            <div className="flex flex-col justify-between gap-3 md:flex-row">
              <div>
                <h3 className="text-xl font-semibold text-slate-100">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm font-semibold text-emerald-300">
                  {item.organization}
                </p>
              </div>

              <div className="text-sm text-slate-400 md:text-right">
                {item.period ? <p>{item.period}</p> : null}
                {item.location ? <p>{item.location}</p> : null}
              </div>
            </div>

            <p className="mt-5 leading-7 text-slate-400">{item.description}</p>

            <ul className="mt-5 grid gap-3 md:grid-cols-2">
              {item.highlights.map((highlight) => (
                <li key={highlight} className="text-sm text-slate-300">
                  <span className="mr-2 text-emerald-300">▸</span>
                  {highlight}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
