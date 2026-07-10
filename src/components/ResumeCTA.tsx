import Link from "next/link";
import type { SiteProfile } from "@/lib/portfolio-data";

type ResumeCTAProps = {
  siteProfile: SiteProfile;
};

export function ResumeCTA({ siteProfile }: ResumeCTAProps) {
  const resumeHref = siteProfile.resumePdfUrl || siteProfile.resumePath;
  const resumeDownloadHref = siteProfile.resumePdfUrl
    ? `${siteProfile.resumePdfUrl}?download=Genesis_Polotan_Resume.pdf`
    : siteProfile.resumePath;

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="rounded-3xl border border-emerald-400/15 bg-slate-950/80 p-8 shadow-2xl shadow-emerald-500/10 md:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">
          Resume
        </p>

        <h2 className="mt-3 text-3xl font-bold text-slate-50">
          Want the full technical summary?
        </h2>

        <p className="mt-4 max-w-3xl leading-7 text-slate-400">
          Download the resume for a concise overview of education, internship
          experience, technical projects, certifications, and engineering skills.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={resumeHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex rounded-xl bg-emerald-400 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/25 transition hover:-translate-y-0.5 hover:bg-emerald-300"
          >
            View Resume ?
          </Link>

          <Link
            href={resumeDownloadHref}
            download
            className="inline-flex rounded-xl border border-emerald-400/25 bg-slate-950/70 px-6 py-3 text-sm font-bold text-slate-100 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:text-emerald-200"
          >
            Download Resume ?
          </Link>
        </div>
      </div>
    </section>
  );
}
