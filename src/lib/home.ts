import { gabbySite } from "@/data/sites/gabby";
import { heidiSite } from "@/data/sites/heidi";
import { paulSite } from "@/data/sites/paul";
import type { SiteConfig, SiteSection } from "@/data/sites/types";
import { veeSite } from "@/data/sites/vee";
import { getSchoolAnnouncements } from "@/lib/announcements";
import {
  getLocalistEvents,
  getLocEvents,
  getTrumbaEvents,
  type EventItem,
} from "@/lib/events";
import { getGamesCatalog } from "@/lib/games-catalog";
import { getLunchWeek } from "@/lib/lunch";
import { getUpcomingMovies, type MovieItem } from "@/lib/movies";
import { getWeatherForecast, type WeatherForecast } from "@/lib/weather";

export type MemberNote = {
  kicker: string;
  title: string;
  detail?: string;
};

export type HomeDashboardData = {
  weather: WeatherForecast | null;
  games: {
    total: number;
    newestName: string;
    newestBlurb: string;
    newestHref: string;
    live: boolean;
  };
  notes: Partial<Record<string, MemberNote>>;
};

function sectionByType<T extends SiteSection["type"]>(
  site: SiteConfig,
  type: T,
): Extract<SiteSection, { type: T }> | undefined {
  return site.sections.find(
    (section): section is Extract<SiteSection, { type: T }> =>
      section.type === type,
  );
}

function formatShortDate(isoDate: string): string {
  const date = new Date(`${isoDate.slice(0, 10)}T12:00:00Z`);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "America/Denver",
  });
}

function movieNote(movies: MovieItem[]): MemberNote | undefined {
  const movie = movies[0];
  if (!movie) return undefined;
  return {
    kicker: "Next movie",
    title: movie.title,
    detail: movie.subtitle,
  };
}

function eventNote(
  kicker: string,
  events: EventItem[],
): MemberNote | undefined {
  const event = events[0];
  if (!event) return undefined;
  return {
    kicker,
    title: event.title,
    detail: event.subtitle,
  };
}

export async function getHomeData(): Promise<HomeDashboardData> {
  const weatherSection = sectionByType(gabbySite, "weather");
  const paulEvents = paulSite.sections.find(
    (section): section is Extract<SiteSection, { type: "events" }> =>
      section.type === "events" && section.source === "trumba",
  );
  const veeCampus = veeSite.sections.find(
    (section): section is Extract<SiteSection, { type: "events" }> =>
      section.type === "events" && section.source === "localist",
  );
  const veeCity = veeSite.sections.find(
    (section): section is Extract<SiteSection, { type: "events" }> =>
      section.type === "events" && section.source === "loc",
  );
  const lunchSection =
    sectionByType(heidiSite, "lunch") ?? sectionByType(gabbySite, "lunch");
  const newsSection =
    sectionByType(gabbySite, "announcements") ??
    sectionByType(heidiSite, "announcements");

  const [weather, catalog, movies, campusEvents, gwEvents, dcEvents, news, lunch] =
    await Promise.all([
      getWeatherForecast({
        latitude: weatherSection?.latitude ?? 40.5244,
        longitude: weatherSection?.longitude ?? -111.8638,
        timezone: weatherSection?.timezone ?? "America/Denver",
      }),
      getGamesCatalog(),
      getUpcomingMovies({ limit: 1 }),
      paulEvents?.feedUrl
        ? getTrumbaEvents(paulEvents.feedUrl, paulEvents.days ?? 21, 1)
        : Promise.resolve([]),
      veeCampus?.feedUrl
        ? getLocalistEvents(
            veeCampus.feedUrl,
            veeCampus.days ?? 21,
            1,
          )
        : Promise.resolve([]),
      veeCity
        ? getLocEvents(veeCity.days ?? 21, 1)
        : Promise.resolve([]),
      newsSection
        ? getSchoolAnnouncements({
            apiBase: newsSection.apiBase,
            categoryIds: newsSection.categoryIds,
            limit: 2,
          })
        : Promise.resolve([]),
      lunchSection
        ? getLunchWeek({
            district: lunchSection.district,
            school: lunchSection.school,
            menuType: lunchSection.menuType,
            timezone: "America/Denver",
          })
        : Promise.resolve(null),
    ]);

  const newest = catalog.games[catalog.games.length - 1];
  const notes: HomeDashboardData["notes"] = {};

  const paulNote =
    movieNote(movies) ?? eventNote("At the U", campusEvents);
  if (paulNote) notes.Paul = paulNote;

  const veeNote =
    eventNote("At GW", gwEvents) ?? eventNote("In DC", dcEvents);
  if (veeNote) notes.Vee = veeNote;

  const headline = news[0];
  if (headline) {
    notes.Gabby = {
      kicker: "School news",
      title: headline.title,
      detail: formatShortDate(headline.date),
    };
  }

  const lunchToday = lunch?.days.find((day) => day.isToday);
  const lunchItems = lunchToday?.items.filter(Boolean) ?? [];
  const extraNews = news[1];
  if (lunchItems.length > 0) {
    notes.Heidi = {
      kicker: "Lunch today",
      title: lunchItems[0],
      detail:
        lunchItems.length > 1
          ? lunchItems.slice(1, 3).join(" · ")
          : undefined,
    };
  } else if (extraNews) {
    notes.Heidi = {
      kicker: "School news",
      title: extraNews.title,
      detail: formatShortDate(extraNews.date),
    };
  }

  return {
    weather,
    games: {
      total: catalog.games.length,
      newestName: newest?.name ?? "Family games",
      newestBlurb: newest?.blurb ?? "Pick a game and play.",
      newestHref: newest?.href ?? "https://games.thewitzel.family",
      live: catalog.live,
    },
    notes,
  };
}
