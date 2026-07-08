import type { SiteProfile } from "@/lib/portfolio-data";

type AboutProps = {
  siteProfile: SiteProfile;
};

export function About({ siteProfile }: AboutProps) {
  return (
    <section id="about" className="mx-auto max-w-7xl px-6 py-20">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">
        About
      </p>

      <h2 className="mt-3 text-3xl font-bold text-slate-50">
        {siteProfile.aboutTitle}
      </h2>

      <p className="mt-6 max-w-4xl leading-8 text-slate-300">
        {siteProfile.aboutBody}
      </p>
    </section>
  );
}
