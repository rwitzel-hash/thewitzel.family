"use client";

import { useEffect, useState } from "react";
import { ClockIcon } from "@/components/home/icons";

const TIME_ZONE = "America/Denver";

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function ClockTile() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    let timeout = 0;
    const tick = () => {
      const next = new Date();
      setNow(next);
      const wait = (60 - next.getSeconds()) * 1000 - next.getMilliseconds();
      timeout = window.setTimeout(tick, Math.max(wait, 1000));
    };
    tick();
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <article
      data-tilt
      className="glass-tile flex min-h-[148px] flex-col justify-between rounded-[28px] p-4 sm:p-5"
      aria-label="Current time in Denver"
    >
      <span className="grid size-10 place-items-center rounded-2xl bg-violet-300/15 text-violet-100">
        <ClockIcon className="size-5" />
      </span>
      <div>
        <p className="text-[clamp(1.7rem,3vw,2.4rem)] font-semibold leading-none tracking-tight text-white tabular-nums">
          {now ? formatTime(now) : "––:––"}
        </p>
        <p className="mt-2 text-sm text-white/75">
          {now ? formatDate(now) : "Mountain Time"}
        </p>
      </div>
    </article>
  );
}
