import type { SiteConfig } from "./types";

export const gabbySite: SiteConfig = {
  slug: "gabby",
  name: "Gabby",
  emoji: "🎨",
  gradient: "from-amber-400 via-orange-500 to-red-500",
  tagline: "Movies, Draper weather, cat facts, and your week at a glance.",
  sections: [
    {
      type: "movies",
      title: "Upcoming kids movies",
      description: "Family-friendly films and animated releases — ratings and times coming soon.",
      items: [
        {
          title: "Animated adventures",
          subtitle: "New releases perfect for the whole crew.",
          badge: "Placeholder",
        },
        {
          title: "Matinee & discount days",
          subtitle: "Local theater deals around Draper.",
          badge: "Coming soon",
        },
        {
          title: "Watchlist votes",
          subtitle: "Pick the next family movie night.",
          badge: "Coming soon",
        },
      ],
    },
    {
      type: "weather",
      title: "Draper weather",
      location: "Draper, Utah",
      description: "Live forecast and daily highs — weather API hookup coming soon.",
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
      ],
    },
    {
      type: "calendar",
      title: "This week",
      description: "Your upcoming week in calendar view.",
      integrationNote: "Google Calendar integration coming soon — events will sync here automatically.",
    },
  ],
};
