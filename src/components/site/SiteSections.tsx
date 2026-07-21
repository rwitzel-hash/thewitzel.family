import { FactCard } from "./FactCard";
import { PlaceholderList } from "./PlaceholderList";
import { SectionCard } from "./SectionCard";
import { WeatherPlaceholder } from "./WeatherPlaceholder";
import { WeekCalendarPlaceholder } from "./WeekCalendarPlaceholder";
import type { SiteSection } from "@/data/sites/types";

function pickFact(facts: string[], seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return facts[hash % facts.length];
}

type SiteSectionsProps = {
  sections: SiteSection[];
  seed: string;
};

export function SiteSections({ sections, seed }: SiteSectionsProps) {
  return (
    <>
      {sections.map((section, index) => {
        const key = `${section.type}-${section.title}-${index}`;

        if (section.type === "movies") {
          return (
            <SectionCard
              key={key}
              title={section.title}
              description={section.description}
            >
              <PlaceholderList items={section.items} />
            </SectionCard>
          );
        }

        if (section.type === "events") {
          return (
            <SectionCard
              key={key}
              title={section.title}
              description={section.description}
              location={section.location}
            >
              <PlaceholderList items={section.items} />
            </SectionCard>
          );
        }

        if (section.type === "weather") {
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

        return (
          <WeekCalendarPlaceholder
            key={key}
            title={section.title}
            description={section.description}
            integrationNote={section.integrationNote}
          />
        );
      })}
    </>
  );
}
