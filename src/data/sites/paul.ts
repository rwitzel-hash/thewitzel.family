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
      description: "Theatrical releases and streaming picks — full listings coming soon.",
      items: [
        {
          title: "Summer blockbuster watchlist",
          subtitle: "Release dates and showtimes will land here.",
          badge: "Placeholder",
        },
        {
          title: "IMAX & matinee picks",
          subtitle: "Theaters near the Wasatch Front.",
          badge: "Coming soon",
        },
        {
          title: "Family movie night queue",
          subtitle: "Votes and reviews from the crew.",
          badge: "Coming soon",
        },
      ],
    },
    {
      type: "events",
      title: "University of Utah events",
      description: "Campus happenings, athletics, and lectures around the U.",
      location: "University of Utah · Salt Lake City",
      items: [
        {
          title: "Campus calendar sync",
          subtitle: "Football, basketball, and performing arts.",
          badge: "Placeholder",
        },
        {
          title: "Student life & lectures",
          subtitle: "Talks, festivals, and community nights.",
          badge: "Coming soon",
        },
        {
          title: "Rice-Eccles & Huntsman Center",
          subtitle: "Game-day reminders when schedules go live.",
          badge: "Coming soon",
        },
      ],
    },
  ],
};
