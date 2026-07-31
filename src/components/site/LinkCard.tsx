import { SectionCard } from "./SectionCard";

type LinkCardProps = {
  title: string;
  description: string;
  href: string;
  cta: string;
  location?: string;
};

export function LinkCard({
  title,
  description,
  href,
  cta,
  location,
}: LinkCardProps) {
  return (
    <SectionCard title={title} description={description} location={location}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
      >
        {cta}
        <span aria-hidden="true">→</span>
      </a>
    </SectionCard>
  );
}
