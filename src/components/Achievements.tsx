import type { Achievement } from "@/types";

type AchievementsProps = {
  achievements: Achievement[];
};

export function Achievements({ achievements }: AchievementsProps) {
  return (
    <section id="achievements" className="mx-auto max-w-7xl px-6 py-20">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">
        Achievements
      </p>

      <h2 className="mt-3 text-3xl font-bold text-slate-50">
        Achievements and recognition
      </h2>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {achievements.map((achievement) => (
          <article
            key={achievement.id}
            className="rounded-2xl border border-emerald-400/10 bg-slate-950/75 p-6 shadow-lg shadow-emerald-500/5 transition hover:-translate-y-1 hover:border-emerald-400/35 hover:bg-emerald-400/[0.03]"
          >
            <h3 className="text-xl font-semibold text-slate-100">
              {achievement.title}
            </h3>

            <p className="mt-4 text-sm leading-6 text-slate-400">
              {achievement.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
