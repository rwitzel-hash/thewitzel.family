export type PlaceholderItem = {
  title: string;
  subtitle?: string;
  badge?: string;
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
    };

export type SiteConfig = {
  slug: string;
  name: string;
  emoji: string;
  gradient: string;
  tagline: string;
  sections: SiteSection[];
};
