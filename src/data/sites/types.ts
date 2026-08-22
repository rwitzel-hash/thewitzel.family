export type PlaceholderItem = {
  title: string;
  subtitle?: string;
  badge?: string;
  href?: string;
};

export type GoogleCalendarEmbed = {
  name: string;
  embedSrc: string;
};

export type SiteSection =
  | {
      type: "movies";
      title: string;
      description: string;
      region?: string;
      limit?: number;
    }
  | {
      type: "events";
      title: string;
      description: string;
      location: string;
      source: "trumba" | "localist" | "loc";
      /** Trumba calendar webname, or Localist site origin (e.g. https://calendar.gwu.edu). */
      feedUrl?: string;
      limit?: number;
      days?: number;
    }
  | {
      type: "weather";
      title: string;
      location: string;
      description: string;
      latitude?: number;
      longitude?: number;
      timezone?: string;
    }
  | {
      type: "facts";
      title: string;
      description: string;
      emoji: string;
      facts: string[];
    }
  | {
      type: "calendar";
      title: string;
      description: string;
      integrationNote: string;
    }
  | {
      type: "google-calendars";
      title: string;
      description: string;
      calendars: GoogleCalendarEmbed[];
    }
  | {
      type: "lunch";
      title: string;
      description: string;
      district: string;
      school: string;
      menuType: string;
      sourceUrl: string;
    }
  | {
      type: "announcements";
      title: string;
      description: string;
      apiBase: string;
      sourceUrl: string;
      categoryIds?: number[];
    }
  | {
      type: "reading";
      title: string;
      description: string;
      tone: "younger" | "older";
    }
  | {
      type: "link";
      title: string;
      description: string;
      href: string;
      cta: string;
      location?: string;
    };

export type SiteConfig = {
  slug: string;
  name: string;
  emoji: string;
  gradient: string;
  tagline: string;
  sections: SiteSection[];
};
