import { SectionCard } from "./SectionCard";
import type { LunchWeek } from "@/lib/lunch";

type LunchCardProps = {
  title: string;
  description: string;
  sourceUrl: string;
  menu: LunchWeek | null;
};

function formatDay(date: string): string {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function isWeekend(date: string): boolean {
  const day = new Date(`${date}T12:00:00`).getDay();
  return day === 0 || day === 6;
}

export function LunchCard({
  title,
  description,
  sourceUrl,
  menu,
}: LunchCardProps) {
  const schoolDays =
    menu?.days.filter((day) => !isWeekend(day.date) && day.items.length > 0) ??
    [];
  const weekdays = menu?.days.filter((day) => !isWeekend(day.date)) ?? [];

  return (
    <SectionCard title={title} description={description}>
      {!menu ? (
        <p className="text-sm text-white/55">
          Lunch menu couldn&apos;t load right now.{" "}
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-white/30 underline-offset-4 hover:decoration-white/70"
          >
            Open Nutrislice
          </a>
        </p>
      ) : schoolDays.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm leading-relaxed text-white/70">
            No lunch items published for this week yet — menus often appear
            closer to the school year / after summer break.
          </p>
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex text-sm font-semibold text-rose-200 hover:text-white"
          >
            Check Nutrislice →
          </a>
        </div>
      ) : (
        <div className="space-y-3">
          {weekdays.map((day) => (
            <div
              key={day.date}
              className="rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <p className="text-sm font-semibold text-white">
                {formatDay(day.date)}
              </p>
              {day.items.length === 0 ? (
                <p className="mt-2 text-sm text-white/45">No menu posted</p>
              ) : (
                <ul className="mt-2 space-y-1">
                  {day.items.map((item) => (
                    <li key={item} className="text-sm text-white/75">
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex text-sm font-semibold text-rose-200 hover:text-white"
          >
            Full menu & nutrition on Nutrislice →
          </a>
        </div>
      )}
    </SectionCard>
  );
}
