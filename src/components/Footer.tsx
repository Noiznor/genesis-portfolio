import Link from "next/link";
import type { SiteProfile } from "@/lib/portfolio-data";

type FooterProps = {
  siteProfile: SiteProfile;
};

export function Footer({ siteProfile }: FooterProps) {
  return (
    <footer className="border-t border-emerald-400/10 px-6 py-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
        <p>
          © {new Date().getFullYear()} {siteProfile.ownerName}. Built as a
          professional engineering portfolio.
        </p>

        <div className="flex flex-wrap gap-4">
          <Link
            href={siteProfile.personalGithub}
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-emerald-300"
          >
            GitHub
          </Link>

          <Link
            href={siteProfile.sphrGithub}
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-emerald-300"
          >
            SPHR
          </Link>

          <Link
            href={`mailto:${siteProfile.email}`}
            className="transition hover:text-emerald-300"
          >
            Email
          </Link>
        </div>
      </div>
    </footer>
  );
}
