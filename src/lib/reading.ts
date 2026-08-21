export type ReadingTone = "younger" | "older";

export type ReadingSession = {
  id: string;
  date: string;
  minutes: number;
  book?: string;
};

export type ReadingFunFact = {
  emoji: string;
  text: string;
};

function weekStart(date: Date): Date {
  const copy = new Date(date);
  const day = copy.getDay();
  const offset = day === 0 ? -6 : 1 - day;
  copy.setDate(copy.getDate() + offset);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export function sumMinutes(sessions: ReadingSession[]): number {
  return sessions.reduce((total, session) => total + session.minutes, 0);
}

export function sessionsInLastDays(
  sessions: ReadingSession[],
  days: number,
): ReadingSession[] {
  const cutoff = new Date();
  cutoff.setHours(0, 0, 0, 0);
  cutoff.setDate(cutoff.getDate() - (days - 1));
  const cutoffKey = cutoff.toISOString().slice(0, 10);

  return sessions.filter((session) => session.date >= cutoffKey);
}

export function sessionsThisWeek(sessions: ReadingSession[]): ReadingSession[] {
  const start = weekStart(new Date()).toISOString().slice(0, 10);
  return sessions.filter((session) => session.date >= start);
}

export function uniqueBooks(sessions: ReadingSession[]): string[] {
  const books = sessions
    .map((session) => session.book?.trim())
    .filter((book): book is string => Boolean(book));
  return [...new Set(books)];
}

export function buildReadingFunFacts(
  sessions: ReadingSession[],
  tone: ReadingTone,
): ReadingFunFact[] {
  const week = sessionsThisWeek(sessions);
  const weekMinutes = sumMinutes(week);
  const totalMinutes = sumMinutes(sessions);
  const books = uniqueBooks(sessions);
  const facts: ReadingFunFact[] = [];

  if (weekMinutes <= 0 && totalMinutes <= 0) {
    return [
      {
        emoji: "📖",
        text:
          tone === "younger"
            ? "Log your first minutes and watch the fun facts unlock!"
            : "Start a reading streak — your stats will show up here.",
      },
    ];
  }

  if (weekMinutes > 0) {
    const pages = Math.max(1, Math.round(weekMinutes * 1.5)); // ~1.5 pages/min rough
    const storyMiles = (weekMinutes / 20).toFixed(1); // playful “story miles”
    const songs = Math.max(1, Math.round(weekMinutes / 3.5));

    if (tone === "younger") {
      facts.push({
        emoji: "📚",
        text: `This week you read about ${pages} pages — enough to fill a cozy reading fort.`,
      });
      facts.push({
        emoji: "🚀",
        text: `That’s roughly ${storyMiles} story-miles of adventure this week.`,
      });
      facts.push({
        emoji: "🎵",
        text: `Your reading time equals about ${songs} favorite songs back-to-back.`,
      });
    } else {
      facts.push({
        emoji: "🧠",
        text: `This week: ${weekMinutes} minutes — about ${pages} pages of plot twists and new worlds.`,
      });
      facts.push({
        emoji: "🗺️",
        text: `That’s ~${storyMiles} story-miles. Keep going and you’ll cross a chapter continent.`,
      });
      facts.push({
        emoji: "⚡",
        text: `${weekMinutes} focused minutes beats doomscrolling. Your future self says thanks.`,
      });
    }
  }

  if (totalMinutes >= 60) {
    const hours = (totalMinutes / 60).toFixed(1);
    facts.push({
      emoji: "⏳",
      text:
        tone === "younger"
          ? `All-time total: ${hours} hours of reading power!`
          : `All-time: ${hours} hours in books — that’s real skill stacking.`,
    });
  }

  if (books.length > 0) {
    facts.push({
      emoji: "✨",
      text:
        tone === "younger"
          ? `Book shelf so far: ${books.slice(0, 3).join(", ")}${books.length > 3 ? "…" : ""}`
          : `On your list: ${books.slice(0, 3).join(", ")}${books.length > 3 ? ` +${books.length - 3} more` : ""}`,
    });
  }

  return facts.slice(0, 4);
}

export function denverDateKey(date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Denver",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}
