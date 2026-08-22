import type { SiteConfig } from "./types";

export const paulSite: SiteConfig = {
  slug: "paul",
  name: "Paul",
  emoji: "🎬",
  gradient: "from-slate-400 via-zinc-500 to-stone-600",
  tagline: "Movies on the horizon and Utes events worth catching.",
  sections: [
    {
      type: "movies",
      title: "Upcoming movies",
      description: "US releases on the horizon (from Wikipedia’s film lists).",
      region: "US",
      limit: 10,
    },
    {
      type: "events",
      title: "University of Utah events",
      description: "Campus happenings, athletics, and lectures around the U.",
      location: "University of Utah · Salt Lake City",
      source: "trumba",
      feedUrl: "university-of-utah",
      days: 21,
      limit: 10,
    },
  ],
};
