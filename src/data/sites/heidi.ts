import type { SiteConfig } from "./types";

export const heidiSite: SiteConfig = {
  slug: "heidi",
  name: "Heidi",
  emoji: "✨",
  gradient: "from-pink-400 via-rose-500 to-red-400",
  tagline: "Weather, science, cats, and your week ahead.",
  sections: [
    {
      type: "weather",
      title: "Upcoming weather",
      location: "Draper, Utah",
      description: "Daily forecast and what to wear — live weather data coming soon.",
    },
    {
      type: "facts",
      title: "Random science fact",
      description: "Something cool from biology, space, or chemistry.",
      emoji: "🔬",
      facts: [
        "Honey never spoils — archaeologists have found edible honey in ancient Egyptian tombs.",
        "Octopuses have three hearts and blue blood.",
        "Lightning is five times hotter than the surface of the sun.",
        "Bananas are berries, but strawberries are not.",
        "A day on Venus is longer than a year on Venus.",
        "Your brain uses about 20% of your body's total energy.",
        "Water can boil and freeze at the same time — it's called the triple point.",
        "There are more stars in the universe than grains of sand on Earth.",
      ],
    },
    {
      type: "facts",
      title: "Random cat fact",
      description: "Because cats are science-adjacent (they run experiments on humans).",
      emoji: "🐱",
      facts: [
        "Cats can make over 100 different vocal sounds; dogs make about 10.",
        "A cat's whiskers are roughly as wide as its body — they use them to judge gaps.",
        "Cats sweat through their paw pads, not their fur.",
        "The oldest known pet cat lived with a human about 9,500 years ago.",
        "Cats have a special collarbone that lets them always land on their feet — usually.",
        "A cat's heart beats almost twice as fast as a human heart.",
        "Cats can see in light six times dimmer than what humans need.",
        "Kittens are born with blue eyes; the color often changes as they grow.",
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
