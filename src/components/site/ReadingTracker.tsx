"use client";

import { useEffect, useMemo, useState } from "react";
import { SectionCard } from "./SectionCard";
import {
  buildReadingFunFacts,
  denverDateKey,
  sessionsThisWeek,
  sumMinutes,
  type ReadingSession,
  type ReadingTone,
} from "@/lib/reading";

type ReadingTrackerProps = {
  slug: string;
  title: string;
  description: string;
  tone: ReadingTone;
};

const QUICK_MINUTES = [5, 10, 15, 20, 30];

function storageKey(slug: string): string {
  return `reading-tracker:${slug}`;
}

function loadSessions(slug: string): ReadingSession[] {
  try {
    const raw = window.localStorage.getItem(storageKey(slug));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ReadingSession[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveSessions(slug: string, sessions: ReadingSession[]) {
  window.localStorage.setItem(storageKey(slug), JSON.stringify(sessions));
}

export function ReadingTracker({
  slug,
  title,
  description,
  tone,
}: ReadingTrackerProps) {
  const [sessions, setSessions] = useState<ReadingSession[]>([]);
  const [ready, setReady] = useState(false);
  const [minutes, setMinutes] = useState(10);
  const [book, setBook] = useState("");
  const [date, setDate] = useState(denverDateKey());

  useEffect(() => {
    setSessions(loadSessions(slug));
    setDate(denverDateKey());
    setReady(true);
  }, [slug]);

  useEffect(() => {
    if (!ready) return;
    saveSessions(slug, sessions);
  }, [ready, sessions, slug]);

  const weekSessions = useMemo(() => sessionsThisWeek(sessions), [sessions]);
  const weekMinutes = sumMinutes(weekSessions);
  const todayMinutes = sumMinutes(
    sessions.filter((session) => session.date === denverDateKey()),
  );
  const funFacts = useMemo(
    () => buildReadingFunFacts(sessions, tone),
    [sessions, tone],
  );

  const recent = useMemo(() => {
    const byDate = new Map<
      string,
      { minutes: number; books: string[] }
    >();

    for (const session of sessions) {
      const current = byDate.get(session.date) ?? { minutes: 0, books: [] };
      current.minutes += session.minutes;
      if (session.book && !current.books.includes(session.book)) {
        current.books.push(session.book);
      }
      byDate.set(session.date, current);
    }

    return [...byDate.entries()]
      .sort((a, b) => b[0].localeCompare(a[0]))
      .slice(0, 7);
  }, [sessions]);

  function addReading() {
    const cleanMinutes = Math.max(1, Math.min(300, Math.round(minutes) || 0));
    if (!cleanMinutes) return;

    const next: ReadingSession = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      date,
      minutes: cleanMinutes,
      book: book.trim() || undefined,
    };

    setSessions((prev) => [next, ...prev]);
    setBook("");
  }

  return (
    <SectionCard title={title} description={description}>
      {!ready ? (
        <p className="text-sm text-white/55">Loading your reading log…</p>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/45">
                Today
              </p>
              <p className="mt-1 font-display text-3xl font-bold text-white">
                {todayMinutes}
                <span className="ml-1 text-base font-semibold text-white/50">
                  min
                </span>
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/45">
                This week
              </p>
              <p className="mt-1 font-display text-3xl font-bold text-white">
                {weekMinutes}
                <span className="ml-1 text-base font-semibold text-white/50">
                  min
                </span>
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/45">
                Sessions
              </p>
              <p className="mt-1 font-display text-3xl font-bold text-white">
                {sessions.length}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
            <p className="text-sm font-semibold text-white">
              {tone === "younger" ? "Add reading time" : "Log a reading session"}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {QUICK_MINUTES.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setMinutes(value)}
                  className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                    minutes === value
                      ? "bg-white text-zinc-900"
                      : "bg-white/10 text-white hover:bg-white/15"
                  }`}
                >
                  {value} min
                </button>
              ))}
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
              <label className="block text-sm text-white/70">
                Minutes
                <input
                  type="number"
                  min={1}
                  max={300}
                  value={minutes}
                  onChange={(event) => setMinutes(Number(event.target.value))}
                  className="mt-1 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white outline-none focus:border-white/40"
                />
              </label>
              <label className="block text-sm text-white/70">
                Date
                <input
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white outline-none focus:border-white/40"
                />
              </label>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={addReading}
                  className="w-full rounded-xl bg-white px-4 py-2 text-sm font-bold text-zinc-900 transition hover:bg-white/90"
                >
                  Add
                </button>
              </div>
            </div>

            <label className="mt-3 block text-sm text-white/70">
              Book{" "}
              <span className="text-white/40">
                {tone === "younger" ? "(optional)" : "(optional — title or series)"}
              </span>
              <input
                type="text"
                value={book}
                onChange={(event) => setBook(event.target.value)}
                placeholder={
                  tone === "younger"
                    ? "Dog Man, Magic Tree House…"
                    : "Percy Jackson, Wings of Fire…"
                }
                className="mt-1 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white outline-none placeholder:text-white/30 focus:border-white/40"
              />
            </label>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-white">Fun reading stats</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {funFacts.map((fact) => (
                <div
                  key={fact.text}
                  className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-4"
                >
                  <p className="text-2xl" aria-hidden="true">
                    {fact.emoji}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-white/80">
                    {fact.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {recent.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-white">Recent days</p>
              <ul className="space-y-2">
                {recent.map(([day, info]) => (
                  <li
                    key={day}
                    className="flex items-start justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm"
                  >
                    <div>
                      <p className="font-medium text-white">
                        {new Date(`${day}T12:00:00`).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </p>
                      {info.books.length > 0 ? (
                        <p className="text-white/55">{info.books.join(", ")}</p>
                      ) : null}
                    </div>
                    <p className="shrink-0 font-semibold text-white">
                      {info.minutes} min
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      )}
    </SectionCard>
  );
}
