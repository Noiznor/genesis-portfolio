import type { Certification } from "@/types";

type CertificationsProps = {
  certifications: Certification[];
};

export function Certifications({ certifications }: CertificationsProps) {
  return (
    <section id="certifications" className="mx-auto max-w-7xl px-6 py-24">
      <div className="mb-12 max-w-3xl">
        <p className="font-mono text-sm font-bold uppercase tracking-[0.3em] text-emerald-300">
          Certifications
        </p>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">
          Professional credentials and technical training.
        </h2>
        <p className="mt-5 text-base leading-8 text-slate-300">
          Certifications that support Genesis&apos; technical foundation in
          networking, cybersecurity, and systems engineering.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {certifications.map((certification) => (
          <article
            key={certification.id}
            className="group overflow-hidden rounded-2xl border border-emerald-400/15 bg-slate-950/75 shadow-lg shadow-emerald-500/5 transition hover:-translate-y-1 hover:border-emerald-300/40 hover:shadow-emerald-500/10"
          >
            {certification.certificateImageUrl ? (
              <div className="border-b border-emerald-400/10 bg-slate-900/60">
                <img
                  src={certification.certificateImageUrl}
                  alt={`${certification.title} certificate`}
                  className="h-48 w-full object-cover"
                />
              </div>
            ) : (
              <div className="flex h-48 items-center justify-center border-b border-emerald-400/10 bg-emerald-400/[0.03]">
                <div className="rounded-2xl border border-emerald-400/20 bg-slate-950/80 px-6 py-4 text-center">
                  <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-emerald-300">
                    Certificate
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-200">
                    Image ready
                  </p>
                </div>
              </div>
            )}

            <div className="p-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1 text-xs font-semibold text-emerald-200">
                  {certification.issuer}
                </span>

                {certification.issueDate ? (
                  <span className="rounded-full border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-300">
                    {certification.issueDate}
                  </span>
                ) : null}
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-50 transition group-hover:text-emerald-200">
                {certification.title}
              </h3>

              <p className="mt-4 text-sm leading-7 text-slate-300">
                {certification.description}
              </p>

              {certification.credentialId ? (
                <p className="mt-4 font-mono text-xs text-slate-500">
                  Credential ID: {certification.credentialId}
                </p>
              ) : null}

              {certification.credentialUrl ? (
                <a
                  href={certification.credentialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex text-sm font-bold text-emerald-300 transition hover:text-emerald-200"
                >
                  View Credential →
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
