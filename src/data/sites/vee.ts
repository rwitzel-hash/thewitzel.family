import type { SiteConfig } from "./types";

export const veeSite: SiteConfig = {
  slug: "vee",
  name: "Vee",
  emoji: "🌟",
  gradient: "from-yellow-300 via-amber-400 to-orange-400",
  tagline: "Cool things happening in DC — especially around GW.",
  sections: [
    {
      type: "events",
      title: "Washington, DC events",
      description:
        "Library of Congress programs on Capitol Hill and around town.",
      location: "Washington, DC",
      source: "loc",
      days: 21,
      limit: 10,
    },
    {
      type: "events",
      title: "George Washington University",
      description: "Colonials games, campus events, and Foggy Bottom plans.",
      location: "George Washington University · Foggy Bottom",
      source: "localist",
      feedUrl: "https://calendar.gwu.edu",
      days: 21,
      limit: 12,
    },
  ],
};
