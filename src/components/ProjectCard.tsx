import type { Project } from "@/data/projects";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  const { name, description, href, emoji, gradient, comingSoon } = project;

  const cardContent = (
    <>
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-90 transition-opacity group-hover:opacity-100`}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_55%)]" />
      <div className="relative flex h-full flex-col justify-between p-6">
        <div className="flex items-start justify-between gap-3">
          <span className="text-5xl drop-shadow-md" aria-hidden="true">
            {emoji}
          </span>
          {comingSoon && (
            <span className="rounded-full bg-white/25 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
              Soon
            </span>
          )}
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white drop-shadow-sm">{name}</h3>
          <p className="mt-2 text-sm leading-relaxed text-white/90">{description}</p>
          {!comingSoon && href && (
            <p className="mt-4 text-sm font-semibold text-white/95">
              Visit →
            </p>
          )}
        </div>
      </div>
    </>
  );

  const sharedClasses =
    "group relative block h-full min-h-[220px] overflow-hidden rounded-3xl shadow-lg transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";

  if (comingSoon || !href) {
    return (
      <div
        className={`${sharedClasses} cursor-default opacity-75 saturate-75`}
        aria-disabled="true"
      >
        {cardContent}
      </div>
    );
  }

  return (
    <a
      href={href}
      className={sharedClasses}
      target="_blank"
      rel="noopener noreferrer"
    >
      {cardContent}
    </a>
  );
}
