import { SectionCard } from "./SectionCard";
import type { SchoolAnnouncement } from "@/lib/announcements";

type AnnouncementsCardProps = {
  title: string;
  description: string;
  sourceUrl: string;
  announcements: SchoolAnnouncement[];
};

function formatDate(date: string): string {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function AnnouncementsCard({
  title,
  description,
  sourceUrl,
  announcements,
}: AnnouncementsCardProps) {
  return (
    <SectionCard title={title} description={description}>
      {announcements.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-white/65">
            No announcements loaded right now.
          </p>
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex text-sm font-semibold text-rose-200 hover:text-white"
          >
            Visit the school site →
          </a>
        </div>
      ) : (
        <ul className="space-y-3">
          {announcements.map((item) => (
            <li key={item.id}>
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
              >
                <p className="text-xs font-semibold uppercase tracking-widest text-white/45">
                  {formatDate(item.date)}
                </p>
                <h3 className="mt-1 font-semibold text-white">{item.title}</h3>
                {item.excerpt ? (
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/65">
                    {item.excerpt}
                  </p>
                ) : null}
              </a>
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  );
}
