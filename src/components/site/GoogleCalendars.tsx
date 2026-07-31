import { SectionCard } from "./SectionCard";
import type { GoogleCalendarEmbed } from "@/data/sites/types";

type GoogleCalendarsProps = {
  title: string;
  description: string;
  calendars: GoogleCalendarEmbed[];
};

export function GoogleCalendars({
  title,
  description,
  calendars,
}: GoogleCalendarsProps) {
  return (
    <SectionCard title={title} description={description}>
      <div className="grid gap-6 lg:grid-cols-2">
        {calendars.map((calendar) => (
          <div key={calendar.embedSrc} className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-widest text-white/45">
              {calendar.name}
            </p>
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white">
              <iframe
                src={calendar.embedSrc}
                title={`${calendar.name} Google Calendar`}
                className="h-[420px] w-full"
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
