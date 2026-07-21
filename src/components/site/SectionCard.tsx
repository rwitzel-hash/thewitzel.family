type SectionCardProps = {
  title: string;
  description?: string;
  location?: string;
  children: React.ReactNode;
};

export function SectionCard({
  title,
  description,
  location,
  children,
}: SectionCardProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm sm:p-8">
      <div className="mb-5">
        {location && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/45">
            {location}
          </p>
        )}
        <h2 className="font-display text-2xl font-bold text-white">{title}</h2>
        {description && (
          <p className="mt-2 text-sm leading-relaxed text-white/65">
            {description}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}
