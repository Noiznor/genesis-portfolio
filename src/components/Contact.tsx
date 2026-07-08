import { CheckCircle2, Link as LinkIcon, Mail, MapPin } from "lucide-react";
import Link from "next/link";
import type { SiteProfile } from "@/lib/portfolio-data";

type ContactProps = {
  siteProfile: SiteProfile;
};

function GitHubMark() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 fill-current"
    >
      <path d="M12 2C6.477 2 2 6.589 2 12.253c0 4.533 2.865 8.374 6.839 9.73.5.094.683-.222.683-.494 0-.244-.009-.89-.014-1.747-2.782.62-3.369-1.375-3.369-1.375-.455-1.187-1.11-1.503-1.11-1.503-.908-.637.069-.624.069-.624 1.004.073 1.532 1.057 1.532 1.057.892 1.566 2.341 1.114 2.91.852.091-.662.349-1.114.635-1.37-2.221-.259-4.555-1.139-4.555-5.068 0-1.12.39-2.035 1.03-2.752-.103-.26-.446-1.303.098-2.715 0 0 .84-.276 2.75 1.051A9.368 9.368 0 0 1 12 6.958a9.35 9.35 0 0 1 2.504.345c1.91-1.327 2.748-1.051 2.748-1.051.546 1.412.203 2.455.1 2.715.64.717 1.028 1.632 1.028 2.752 0 3.939-2.337 4.806-4.566 5.06.359.318.679.944.679 1.902 0 1.372-.012 2.478-.012 2.815 0 .274.18.593.688.493C19.138 20.624 22 16.784 22 12.253 22 6.589 17.523 2 12 2Z" />
    </svg>
  );
}

function LinkedInMark() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 fill-current"
    >
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.5 8h4V23h-4V8Zm7.5 0h3.84v2.05h.05c.53-1 1.84-2.05 3.79-2.05 4.05 0 4.8 2.67 4.8 6.14V23h-4v-7.85c0-1.87-.03-4.28-2.61-4.28-2.61 0-3.01 2.04-3.01 4.15V23h-4V8Z" />
    </svg>
  );
}

export function Contact({ siteProfile }: ContactProps) {
  const hasLinkedIn =
    siteProfile.linkedin &&
    siteProfile.linkedin !== "#" &&
    siteProfile.linkedin.startsWith("http");

  return (
    <section
      id="contact"
      className="mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-[0.85fr_1.15fr]"
    >
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-sky-400">
          Contact
        </p>

        <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-50 md:text-5xl">
          Let&apos;s talk about your team
        </h2>

        <div className="mt-12 inline-flex items-center gap-3 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-5 py-3 text-sm font-semibold text-emerald-300 shadow-lg shadow-emerald-500/10">
          <CheckCircle2 className="h-4 w-4" />
          Open for job opportunities
        </div>

        <div className="mt-8 flex items-center gap-4 text-slate-300">
          <MapPin className="h-5 w-5 text-sky-400" />
          <span className="text-base font-medium">{siteProfile.location}</span>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={`mailto:${siteProfile.email}`}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-sky-400/60 hover:bg-sky-400/10 hover:text-sky-200"
          >
            <Mail className="h-4 w-4" />
            Email
          </Link>

          <Link
            href={siteProfile.personalGithub}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-sky-400/60 hover:bg-sky-400/10 hover:text-sky-200"
          >
            <GitHubMark />
            GitHub
          </Link>

          {hasLinkedIn ? (
            <Link
              href={siteProfile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-sky-400/60 hover:bg-sky-400/10 hover:text-sky-200"
            >
              <LinkedInMark />
              LinkedIn
            </Link>
          ) : (
            <span className="inline-flex cursor-not-allowed items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/40 px-4 py-3 text-sm font-semibold text-slate-500">
              <LinkIcon className="h-4 w-4" />
              LinkedIn
            </span>
          )}
        </div>
      </div>

      <form
        action={`https://formsubmit.co/${siteProfile.email}`}
        method="POST"
        className="rounded-2xl border border-slate-700/80 bg-slate-950/70 p-6 shadow-2xl shadow-sky-500/5 backdrop-blur md:p-8"
      >
        <input
          type="hidden"
          name="_subject"
          value="New portfolio message from Genesis portfolio website"
        />
        <input type="hidden" name="_template" value="table" />
        <input type="hidden" name="_captcha" value="true" />
        <input type="text" name="_honey" className="hidden" tabIndex={-1} />

        <div>
          <label
            htmlFor="contact-name"
            className="text-sm font-semibold text-slate-100"
          >
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            placeholder="Your name"
            required
            className="mt-3 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-4 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
          />
        </div>

        <div className="mt-6">
          <label
            htmlFor="contact-email"
            className="text-sm font-semibold text-slate-100"
          >
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            className="mt-3 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-4 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
          />
        </div>

        <div className="mt-6">
          <label
            htmlFor="contact-message"
            className="text-sm font-semibold text-slate-100"
          >
            Message
          </label>
          <textarea
            id="contact-message"
            name="message"
            placeholder="Tell me about the role or project..."
            required
            rows={6}
            className="mt-3 w-full resize-none rounded-lg border border-slate-700 bg-slate-950 px-4 py-4 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
          />
        </div>

        <button
          type="submit"
          className="mt-7 w-full rounded-lg bg-sky-400 px-6 py-4 text-sm font-bold text-slate-950 shadow-lg shadow-sky-500/20 transition hover:-translate-y-0.5 hover:bg-sky-300"
        >
          Send Message
        </button>

        <p className="mt-4 text-xs leading-5 text-slate-500">
          This sends the form to{" "}
          <span className="text-slate-300">{siteProfile.email}</span>.
        </p>
      </form>
    </section>
  );
}
