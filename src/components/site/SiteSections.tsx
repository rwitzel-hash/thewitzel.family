import { AnnouncementsCard } from "./AnnouncementsCard";
import { FactCard } from "./FactCard";
import { GoogleCalendars } from "./GoogleCalendars";
import { LinkCard } from "./LinkCard";
import { LunchCard } from "./LunchCard";
import { PlaceholderList } from "./PlaceholderList";
import { ReadingTracker } from "./ReadingTracker";
import { SectionCard } from "./SectionCard";
import { WeatherCard } from "./WeatherCard";
import { WeatherPlaceholder } from "./WeatherPlaceholder";
import { WeekCalendarPlaceholder } from "./WeekCalendarPlaceholder";
import type { SiteSection } from "@/data/sites/types";
import { getSchoolAnnouncements } from "@/lib/announcements";
import {
  getLocalistEvents,
  getLocEvents,
  getTrumbaEvents,
} from "@/lib/events";
import { getLunchWeek } from "@/lib/lunch";
import { getUpcomingMovies } from "@/lib/movies";
import { getWeatherForecast } from "@/lib/weather";

function pickFact(facts: string[], seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return facts[hash % facts.length];
}

type SiteSectionsProps = {
  slug: string;
  sections: SiteSection[];
  seed: string;
};

export async function SiteSections({
  slug,
  sections,
  seed,
}: SiteSectionsProps) {
  return (
    <>
      {await Promise.all(
        sections.map(async (section, index) => {
          const key = `${section.type}-${section.title}-${index}`;

          if (section.type === "movies") {
            const movies = await getUpcomingMovies({
              region: section.region,
              limit: section.limit,
            });
            return (
              <SectionCard
                key={key}
                title={section.title}
                description={section.description}
              >
                <PlaceholderList
                  items={movies}
                  emptyMessage="No upcoming movies loaded right now."
                />
              </SectionCard>
            );
          }

          if (section.type === "events") {
            const days = section.days ?? 21;
            const limit = section.limit ?? 10;
            const events =
              section.source === "trumba" && section.feedUrl
                ? await getTrumbaEvents(section.feedUrl, days, limit)
                : section.source === "localist" && section.feedUrl
                  ? await getLocalistEvents(section.feedUrl, days, limit)
                  : section.source === "loc"
                    ? await getLocEvents(days, limit)
                    : [];

            return (
              <SectionCard
                key={key}
                title={section.title}
                description={section.description}
                location={section.location}
              >
                <PlaceholderList
                  items={events}
                  emptyMessage="No events loaded right now."
                />
              </SectionCard>
            );
          }

          if (section.type === "weather") {
            if (
              typeof section.latitude === "number" &&
              typeof section.longitude === "number"
            ) {
              const forecast = await getWeatherForecast({
                latitude: section.latitude,
                longitude: section.longitude,
                timezone: section.timezone,
              });
              return (
                <WeatherCard
                  key={key}
                  title={section.title}
                  location={section.location}
                  description={section.description}
                  forecast={forecast}
                />
              );
            }

            return (
              <WeatherPlaceholder
                key={key}
                title={section.title}
                location={section.location}
                description={section.description}
              />
            );
          }

          if (section.type === "facts") {
            return (
              <FactCard
                key={key}
                title={section.title}
                description={section.description}
                emoji={section.emoji}
                fact={pickFact(section.facts, `${seed}:${section.title}`)}
              />
            );
          }

          if (section.type === "google-calendars") {
            return (
              <GoogleCalendars
                key={key}
                title={section.title}
                description={section.description}
                calendars={section.calendars}
              />
            );
          }

          if (section.type === "lunch") {
            const menu = await getLunchWeek({
              district: section.district,
              school: section.school,
              menuType: section.menuType,
            });
            return (
              <LunchCard
                key={key}
                title={section.title}
                description={section.description}
                sourceUrl={section.sourceUrl}
                menu={menu}
              />
            );
          }

          if (section.type === "announcements") {
            const announcements = await getSchoolAnnouncements({
              apiBase: section.apiBase,
              categoryIds: section.categoryIds,
            });
            return (
              <AnnouncementsCard
                key={key}
                title={section.title}
                description={section.description}
                sourceUrl={section.sourceUrl}
                announcements={announcements}
              />
            );
          }

          if (section.type === "reading") {
            return (
              <ReadingTracker
                key={key}
                slug={slug}
                title={section.title}
                description={section.description}
                tone={section.tone}
              />
            );
          }

          if (section.type === "link") {
            return (
              <LinkCard
                key={key}
                title={section.title}
                description={section.description}
                href={section.href}
                cta={section.cta}
                location={section.location}
              />
            );
          }

          return (
            <WeekCalendarPlaceholder
              key={key}
              title={section.title}
              description={section.description}
              integrationNote={section.integrationNote}
            />
          );
        }),
      )}
    </>
  );
}
