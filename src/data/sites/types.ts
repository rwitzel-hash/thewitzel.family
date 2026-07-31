export type PlaceholderItem = {
  title: string;
  subtitle?: string;
  badge?: string;
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
      items: PlaceholderItem[];
    }
  | {
      type: "events";
      title: string;
      description: string;
      location: string;
      items: PlaceholderItem[];
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
