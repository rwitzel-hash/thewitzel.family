import { SectionCard } from "./SectionCard";
import {
  weatherCodeEmoji,
  type WeatherForecast,
} from "@/lib/weather";

type WeatherCardProps = {
  title: string;
  location: string;
  description: string;
  forecast: WeatherForecast | null;
};

function formatWeekday(date: string): string {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
  });
}

export function WeatherCard({
  title,
  location,
  description,
  forecast,
}: WeatherCardProps) {
  return (
    <SectionCard title={title} description={description} location={location}>
      {!forecast ? (
        <p className="text-sm text-white/55">
          Weather is unavailable right now. Try refreshing in a bit.
        </p>
      ) : (
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
            <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-400/30 to-blue-600/30 text-5xl">
              <span aria-hidden="true">
                {weatherCodeEmoji(forecast.weatherCode)}
              </span>
            </div>
            <div>
              <div className="flex items-end gap-3">
                <span className="font-display text-5xl font-bold text-white">
                  {forecast.currentTemp}°
                </span>
                <span className="pb-2 text-sm text-white/55">right now</span>
              </div>
              {forecast.days[0] && (
                <p className="mt-2 text-sm text-white/65">
                  Today {forecast.days[0].high}° / {forecast.days[0].low}° ·{" "}
                  {forecast.days[0].precipChance}% chance of precip
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {forecast.days.map((day) => (
              <div
                key={day.date}
                className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-center"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-white/45">
                  {formatWeekday(day.date)}
                </p>
                <p className="mt-1 text-2xl" aria-hidden="true">
                  {weatherCodeEmoji(day.weatherCode)}
                </p>
                <p className="mt-1 text-sm font-semibold text-white">
                  {day.high}°{" "}
                  <span className="font-normal text-white/45">{day.low}°</span>
                </p>
                <p className="mt-1 text-xs text-white/45">{day.precipChance}%</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </SectionCard>
  );
}
