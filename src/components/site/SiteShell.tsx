import Link from "next/link";
import type { SiteConfig } from "@/data/sites/types";

type SiteShellProps = {
  site: SiteConfig;
  children: React.ReactNode;
};

export function SiteShell({ site, children }: SiteShellProps) {
  return (
    <div className="relative min-h-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[#0f0c29]" />
      <div
        className={`pointer-events-none absolute -left-24 top-0 h-[420px] w-[420px] rounded-full bg-gradient-to-br ${site.gradient} opacity-30 blur-3xl`}
      />
      <div
        className={`pointer-events-none absolute -right-24 bottom-0 h-[380px] w-[380px] rounded-full bg-gradient-to-br ${site.gradient} opacity-20 blur-3xl`}
      />

      <main className="relative mx-auto max-w-5xl px-6 py-10 sm:px-8 sm:py-14">
        <header className="mb-10">
          <Link
            href="https://thewitzel.family"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-sm font-medium text-white/80 backdrop-blur-sm transition hover:bg-white/15"
          >
            <span aria-hidden="true">←</span>
            The Witzel Family
          </Link>

          <div className="mt-8 flex items-center gap-4">
            <span className="text-5xl drop-shadow-md" aria-hidden="true">
              {site.emoji}
            </span>
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-white/50">
                {site.name}&apos;s space
              </p>
              <h1 className="font-display text-4xl font-extrabold text-white sm:text-5xl">
                {site.name}
              </h1>
            </div>
          </div>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/70">
            {site.tagline}
          </p>
        </header>

        <div className="space-y-8">{children}</div>

        <footer className="mt-16 border-t border-white/10 pt-8 text-center text-sm text-white/40">
          <p>
            {site.name}.thewitzel.family · placeholders for now, more coming
            soon
          </p>
        </footer>
      </main>
    </div>
  );
}
