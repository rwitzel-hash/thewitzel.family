import { SectionCard } from "./SectionCard";

type WeatherPlaceholderProps = {
  title: string;
  location: string;
  description: string;
};

export function WeatherPlaceholder({
  title,
  location,
  description,
}: WeatherPlaceholderProps) {
  return (
    <SectionCard title={title} description={description} location={location}>
      <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
        <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-400/30 to-blue-600/30 text-5xl">
          <span aria-hidden="true">🌤️</span>
        </div>
        <div className="space-y-3">
          <div className="flex items-end gap-3">
            <span className="font-display text-5xl font-bold text-white/40">
              —°
            </span>
            <span className="pb-2 text-sm text-white/50">
              Live forecast pending
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {["High", "Low", "Precip"].map((label) => (
              <div
                key={label}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-center"
              >
                <p className="text-xs uppercase tracking-wide text-white/45">
                  {label}
                </p>
                <p className="mt-1 text-sm font-semibold text-white/35">—</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
