import Image from "next/image";
import Link from "next/link";
import { navItems } from "@/data/site";
import type { siteConfig as siteConfigType } from "@/data/site";
import { SmoothScrollLink } from "@/components/SmoothScrollLink";

type NavbarProps = {
  siteConfig: typeof siteConfigType;
};

function GitHubMark() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px] fill-current"
    >
      <path d="M12 2C6.477 2 2 6.589 2 12.253c0 4.533 2.865 8.374 6.839 9.73.5.094.683-.222.683-.494 0-.244-.009-.89-.014-1.747-2.782.62-3.369-1.375-3.369-1.375-.455-1.187-1.11-1.503-1.11-1.503-.908-.637.069-.624.069-.624 1.004.073 1.532 1.057 1.532 1.057.892 1.566 2.341 1.114 2.91.852.091-.662.349-1.114.635-1.37-2.221-.259-4.555-1.139-4.555-5.068 0-1.12.39-2.035 1.03-2.752-.103-.26-.446-1.303.098-2.715 0 0 .84-.276 2.75 1.051A9.368 9.368 0 0 1 12 6.958a9.35 9.35 0 0 1 2.504.345c1.91-1.327 2.748-1.051 2.748-1.051.546 1.412.203 2.455.1 2.715.64.717 1.028 1.632 1.028 2.752 0 3.939-2.337 4.806-4.566 5.06.359.318.679.944.679 1.902 0 1.372-.012 2.478-.012 2.815 0 .274.18.593.688.493C19.138 20.624 22 16.784 22 12.253 22 6.589 17.523 2 12 2Z" />
    </svg>
  );
}

export function Navbar({ siteConfig }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-emerald-400/10 bg-[#020403]/85 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <SmoothScrollLink
          href="#home"
          className="flex items-center gap-3 text-emerald-100 transition hover:text-emerald-300"
        >
          <Image
            src="/brand/site-logo.png"
            alt="Genesis I. Polotan logo"
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
            priority
          />
          <span className="font-mono text-sm font-bold tracking-wide">
            {siteConfig.name}
          </span>
        </SmoothScrollLink>

        <div className="hidden items-center gap-6 text-sm font-medium text-slate-300 md:flex">
          {navItems.map((item) => (
            <SmoothScrollLink
              key={item.href}
              href={item.href as `#${string}`}
              className="transition hover:text-emerald-300"
            >
              {item.label}
            </SmoothScrollLink>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={siteConfig.personalGithub}
            target="_blank"
            rel="noreferrer"
            aria-label="Open personal GitHub profile"
            className="rounded-full border border-emerald-400/20 bg-emerald-400/5 p-2 text-emerald-100 transition hover:border-emerald-300 hover:bg-emerald-400/10 hover:text-emerald-300"
          >
            <GitHubMark />
          </Link>

          <Link
            href={siteConfig.sphrGithub}
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-full border border-emerald-400/30 bg-emerald-400/5 px-4 py-2 font-mono text-xs font-bold text-emerald-200 transition hover:border-emerald-300 hover:bg-emerald-400/10 sm:inline-flex"
          >
            SPHR
          </Link>
        </div>
      </nav>
    </header>
  );
}