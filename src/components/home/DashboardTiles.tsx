import type { Project } from "@/data/projects";
import { gamesHomeUrl } from "@/data/games";
import type { MemberNote } from "@/lib/home";
import type { WeatherForecast } from "@/lib/weather";
import { weatherCodeLabel } from "@/lib/weather";
import {
  ArrowIcon,
  BikeIcon,
  GamepadIcon,
  WeatherIcon,
  WindIcon,
} from "@/components/home/icons";

const tileLink =
  "glass-tile group block h-full rounded-[28px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";

function hostLabel(href?: string): string {
  if (!href) return "";
  try {
    return new URL(href).host;
  } catch {
    return href;
  }
}

function ArrowButton() {
  return (
    <span className="grid size-10 shrink-0 place-items-center rounded-full border border-white/15 bg-white/10 text-white transition group-hover:bg-white/20">
      <ArrowIcon />
    </span>
  );
}

function ContourArt() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-36 w-full text-sky-100/25 sm:h-44"
      viewBox="0 0 640 180"
      preserveAspectRatio="none"
    >
      <path
        d="M0 130 C90 118 140 72 230 82 C320 92 340 40 430 50 C520 60 560 100 640 78"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M0 152 C100 140 160 104 250 112 C350 122 370 78 460 86 C540 94 580 122 640 108"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        opacity="0.75"
      />
      <path
        d="M0 108 C80 98 150 52 240 62 C330 72 360 28 450 36 C530 44 570 74 640 56"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.5"
      />
    </svg>
  );
}

function isHoldEm(name: string, href: string): boolean {
  return /hold.?em/i.test(name) || href.endsWith("/poker");
}

function PlayingCards() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute bottom-5 right-4 hidden h-40 w-44 sm:block"
    >
      <div className="absolute left-1 top-6 h-[8.5rem] w-[6.1rem] -rotate-[16deg] rounded-xl bg-neutral-950 shadow-2xl ring-1 ring-white/10" />
      <div className="absolute left-8 top-2 flex h-[8.5rem] w-[6.1rem] -rotate-[6deg] flex-col justify-between rounded-xl bg-white p-2.5 text-neutral-900 shadow-2xl">
        <span className="text-lg font-semibold leading-none">
          K<span className="mt-0.5 block text-base">♠</span>
        </span>
        <span className="text-center text-3xl leading-none">♠</span>
        <span className="rotate-180 self-end text-lg font-semibold leading-none">
          K<span className="mt-0.5 block text-base">♠</span>
        </span>
      </div>
      <div className="absolute left-[4.6rem] top-5 flex h-[8.5rem] w-[6.1rem] rotate-[8deg] flex-col justify-between rounded-xl bg-white p-2.5 text-red-600 shadow-2xl">
        <span className="text-lg font-semibold leading-none">
          Q<span className="mt-0.5 block text-base">♥</span>
        </span>
        <span className="text-center text-3xl leading-none">♥</span>
        <span className="rotate-180 self-end text-lg font-semibold leading-none">
          Q<span className="mt-0.5 block text-base">♥</span>
        </span>
      </div>
    </div>
  );
}

const accents: Record<string, string> = {
  Paul: "bg-sky-400/20 text-sky-50",
  Vee: "bg-violet-400/20 text-violet-50",
  Gabby: "bg-emerald-400/20 text-emerald-50",
  Heidi: "bg-amber-400/25 text-amber-50",
};

export function RideTile({ project }: { project: Project }) {
  const href = project.href ?? "https://ride.thewitzel.family";

  return (
    <a
      href={href}
      data-tilt
      className={`${tileLink} relative flex min-h-[300px] flex-col justify-between overflow-hidden p-6 sm:min-h-[340px] sm:p-8 lg:col-span-7 lg:row-span-2 lg:h-full`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-sky-400/10 via-transparent to-transparent"
      />
      <ContourArt />
      <div className="relative flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-2xl bg-sky-400/15 text-sky-100">
          <BikeIcon />
        </span>
        <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          {project.name}
        </h2>
      </div>
      <div className="relative mt-8">
        <p className="max-w-md text-lg leading-relaxed text-white/90 sm:text-xl">
          {project.description}
        </p>
        <div className="mt-6 flex items-end justify-between gap-4">
          <p className="text-sm text-white/70">{hostLabel(href)}</p>
          <ArrowButton />
        </div>
      </div>
    </a>
  );
}

export function GamesTile({
  total,
  newestName,
  newestBlurb,
  newestHref,
  live,
}: {
  total: number;
  newestName: string;
  newestBlurb: string;
  newestHref: string;
  live: boolean;
}) {
  const holdEm = isHoldEm(newestName, newestHref);
  const countLabel = live ? `${total} games` : "Catalog unreachable";

  return (
    <a
      href={gamesHomeUrl}
      data-tilt
      className={`${tileLink} relative flex min-h-[250px] flex-col overflow-hidden p-6 sm:p-7 lg:col-span-5`}
    >
      <div className="flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-2xl bg-violet-400/15 text-violet-100">
          <GamepadIcon />
        </span>
        <h2 className="text-2xl font-semibold tracking-tight text-white">
          Games
        </h2>
      </div>
      <div className={`relative mt-6 ${holdEm ? "sm:pr-36" : ""}`}>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-100/80">
          Newest
        </p>
        <p className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-[1.7rem]">
          {newestName}
        </p>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/75 line-clamp-3">
          {newestBlurb}
        </p>
      </div>
      {holdEm ? <PlayingCards /> : null}
      <div className="relative mt-auto flex items-end justify-between gap-4 pt-6">
        <p className="min-w-0 text-sm leading-snug text-white/70">
          <span className="block">{hostLabel(gamesHomeUrl)}</span>
          <span className="mt-0.5 block text-white/60">{countLabel}</span>
        </p>
        <ArrowButton />
      </div>
    </a>
  );
}

export function WeatherTile({
  weather,
}: {
  weather: WeatherForecast | null;
}) {
  const today = weather?.days[0];

  return (
    <article
      data-tilt
      className="glass-tile flex min-h-[148px] flex-col justify-between rounded-[28px] p-4 sm:p-5"
      aria-label="Weather in Draper, Utah"
    >
      <span className="grid size-10 place-items-center rounded-2xl bg-sky-300/15 text-sky-50">
        {weather ? (
          <WeatherIcon code={weather.weatherCode} className="size-5" />
        ) : (
          <WeatherIcon code={3} className="size-5" />
        )}
      </span>
      {weather ? (
        <div>
          <p className="text-[clamp(1.7rem,3vw,2.4rem)] font-semibold leading-none tracking-tight text-white tabular-nums">
            {weather.currentTemp}°
          </p>
          <p className="mt-2 text-sm text-white/80">
            {weatherCodeLabel(weather.weatherCode)}
            <span className="text-white/40"> · </span>
            Draper
          </p>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/65">
            {weather.windMph != null ? (
              <span className="inline-flex items-center gap-1">
                <WindIcon />
                {weather.windMph} mph
              </span>
            ) : null}
            {today ? (
              <span className="tabular-nums">
                H {today.high}° · L {today.low}°
              </span>
            ) : null}
          </p>
        </div>
      ) : (
        <div>
          <p className="text-lg font-semibold tracking-tight text-white">
            Weather
          </p>
          <p className="mt-1 text-sm text-white/75">
            Draper forecast is unavailable right now.
          </p>
        </div>
      )}
    </article>
  );
}

export function PersonTile({
  project,
  note,
}: {
  project: Project;
  note?: MemberNote;
}) {
  const accent = accents[project.name] ?? "bg-white/10 text-white";
  const initial = project.name.slice(0, 1);
  const href = project.href;

  const body = (
    <>
      <div className="flex items-center justify-between gap-3">
        <span
          className={`grid size-11 place-items-center rounded-2xl text-base font-semibold ${accent}`}
          aria-hidden="true"
        >
          {initial}
        </span>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-semibold tracking-tight text-white">
          {project.name}
        </h2>
        <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/55">
          {note ? note.kicker : hostLabel(href)}
        </p>
        <p className="mt-1 text-sm leading-snug text-white/90 line-clamp-2">
          {note ? note.title : project.description}
        </p>
        {note?.detail ? (
          <p className="mt-1 text-sm text-white/65 line-clamp-2">{note.detail}</p>
        ) : null}
      </div>
    </>
  );

  if (!href) {
    return (
      <article data-tilt className="glass-tile h-full rounded-[28px] p-5">
        {body}
      </article>
    );
  }

  return (
    <a href={href} data-tilt className={`${tileLink} p-5`}>
      {body}
    </a>
  );
}

export function SoonTile({ project }: { project: Project }) {
  return (
    <article
      data-tilt
      className="glass-tile flex h-full flex-col justify-between rounded-[28px] p-5"
      aria-label={`${project.name}, coming soon`}
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold tracking-tight text-white">
          {project.name}
        </h2>
        <span className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/80">
          Soon
        </span>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-white/75">
        {project.description}
      </p>
    </article>
  );
}
