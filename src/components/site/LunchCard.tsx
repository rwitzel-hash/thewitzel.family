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
  const weekdays = menu?.days.filter((day) => !isWeekend(day.date)) ?? [];
  const schoolDays = weekdays.filter((day) => day.items.length > 0);
  const today = weekdays.find((day) => day.isToday);

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
            No lunch items published for this week yet.
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
        <div className="space-y-4">
          {today?.items.length ? (
            <div className="rounded-2xl border border-rose-300/30 bg-rose-500/15 p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-rose-100/80">
                Today · {formatDay(today.date)}
              </p>
              <ul className="mt-2 space-y-1">
                {today.items.map((item) => (
                  <li key={item} className="text-sm font-medium text-white">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="space-y-3">
            {weekdays.map((day) => (
              <div
                key={day.date}
                className={`rounded-2xl border p-4 ${
                  day.isToday
                    ? "border-white/20 bg-white/10"
                    : "border-white/10 bg-white/5"
                }`}
              >
                <p className="text-sm font-semibold text-white">
                  {formatDay(day.date)}
                  {day.isToday ? (
                    <span className="ml-2 text-xs font-semibold uppercase tracking-wide text-rose-200">
                      Today
                    </span>
                  ) : null}
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
          </div>

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
