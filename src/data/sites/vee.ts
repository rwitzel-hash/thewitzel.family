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
      description: "Museums, festivals, and city happenings worth the Metro ride.",
      location: "Washington, DC",
      items: [
        {
          title: "Smithsonian & monument season",
          subtitle: "Free exhibits and outdoor evenings.",
          badge: "Placeholder",
        },
        {
          title: "Neighborhood nights",
          subtitle: "Markets, live music, and food halls.",
          badge: "Coming soon",
        },
        {
          title: "Cherry blossom & fall foliage",
          subtitle: "Seasonal highlights around the District.",
          badge: "Coming soon",
        },
      ],
    },
    {
      type: "events",
      title: "George Washington University",
      description: "Colonials games, campus events, and Foggy Bottom plans.",
      location: "George Washington University · Foggy Bottom",
      items: [
        {
          title: "GW athletics calendar",
          subtitle: "Basketball, soccer, and more at Charles E. Smith Center.",
          badge: "Placeholder",
        },
        {
          title: "Campus speakers & clubs",
          subtitle: "Student org events and university programming.",
          badge: "Coming soon",
        },
        {
          title: "Weekend on campus",
          subtitle: "Open houses, performances, and study breaks.",
          badge: "Coming soon",
        },
      ],
    },
  ],
};
