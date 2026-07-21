import { SectionCard } from "./SectionCard";

type WeekCalendarPlaceholderProps = {
  title: string;
  description: string;
  integrationNote: string;
};

function getWeekDays(): { label: string; date: number; isToday: boolean }[] {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(today);
  monday.setHours(12, 0, 0, 0);
  monday.setDate(today.getDate() + mondayOffset);

  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return labels.map((label, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    return {
      label,
      date: date.getDate(),
      isToday: date.toDateString() === today.toDateString(),
    };
  });
}

export function WeekCalendarPlaceholder({
  title,
  description,
  integrationNote,
}: WeekCalendarPlaceholderProps) {
  const weekDays = getWeekDays();

  return (
    <SectionCard title={title} description={description}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-white/55">Upcoming week</p>
        <span className="rounded-full bg-violet-500/25 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-violet-100">
          Google Calendar · coming soon
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {weekDays.map((day) => (
          <div
            key={day.label}
            className={`min-h-[120px] rounded-2xl border p-3 ${
              day.isToday
                ? "border-violet-300/40 bg-violet-500/15"
                : "border-white/10 bg-white/5"
            }`}
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-white/45">
              {day.label}
            </p>
            <p className="font-display text-2xl font-bold text-white">
              {day.date}
            </p>
            <p className="mt-3 text-xs leading-relaxed text-white/40">
              No events synced yet
            </p>
          </div>
        ))}
      </div>

      <p className="mt-4 text-sm text-white/50">{integrationNote}</p>
    </SectionCard>
  );
}
