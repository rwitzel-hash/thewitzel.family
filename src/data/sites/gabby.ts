import type { SiteConfig } from "./types";

export const gabbySite: SiteConfig = {
  slug: "gabby",
  name: "Gabby",
  emoji: "🎨",
  gradient: "from-amber-400 via-orange-500 to-red-500",
  tagline: "Reading goals, lunch, school news, weather, and your week.",
  sections: [
    {
      type: "reading",
      title: "Reading log",
      description:
        "Quick-add minutes (and an optional book title). Watch your weekly stats stack up.",
      tone: "older",
    },
    {
      type: "weather",
      title: "Draper weather",
      location: "Draper, Utah",
      description: "Live forecast for today and the next few days.",
      latitude: 40.5244,
      longitude: -111.8638,
      timezone: "America/Denver",
    },
    {
      type: "lunch",
      title: "Lone Peak lunch",
      description: "This week’s menu from Canyons School District / Nutrislice.",
      district: "canyonsdistrict",
      school: "lone-peak-elementary",
      menuType: "lunch-2",
      sourceUrl: "https://canyonsdistrict.nutrislice.com/menu/lone-peak-elementary",
    },
    {
      type: "announcements",
      title: "School announcements",
      description: "Latest news from Lone Peak Elementary.",
      apiBase: "https://lonepeak.canyonsdistrict.org",
      sourceUrl: "https://lonepeak.canyonsdistrict.org/",
    },
    {
      type: "link",
      title: "Lone Peak school calendar",
      description:
        "Early outs, holidays, conferences, and school events.",
      location: "Lone Peak Elementary · Canyons School District",
      href: "https://lonepeak.canyonsdistrict.org/calendar/",
      cta: "Open school calendar",
    },
    {
      type: "google-calendars",
      title: "Family calendar",
      description: "Shared family events for the week.",
      calendars: [
        {
          name: "Family",
          embedSrc:
            "https://calendar.google.com/calendar/embed?src=47umno8geark1o2qa3qi54fq1k%40group.calendar.google.com&ctz=America%2FDenver",
        },
      ],
    },
    {
      type: "facts",
      title: "Random cat fact",
      description: "A fresh feline fact every visit.",
      emoji: "🐱",
      facts: [
        "Cats spend about 70% of their lives sleeping — roughly 13–16 hours a day.",
        "A group of cats is called a clowder.",
        "Cats can rotate their ears 180 degrees to pinpoint sounds.",
        "A cat's nose print is unique, like a human fingerprint.",
        "Cats have an extra organ that lets them taste scents in the air.",
        "The average cat can jump up to six times its body length.",
        "A cat's purr vibrates between 25 and 150 hertz — a soothing frequency.",
        "Ancient Egyptians revered cats and often depicted them in art.",
        "Cats have 32 muscles in each ear.",
        "A cat can run about 30 mph in short bursts.",
        "Cats prefer drinking moving water — faucet fans unite.",
        "Most cats are lactose intolerant, even if they beg for milk.",
      ],
    },
  ],
};
