export type EventItem = {
  title: string;
  subtitle?: string;
  badge?: string;
  href?: string;
};

type RankedEvent = EventItem & { startMs: number };

function stripHtml(value: string): string {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#8217;/g, "'")
    .replace(/&#8211;/g, "–")
    .replace(/&#8230;/g, "…")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function formatEventWhen(
  iso: string,
  allDay?: boolean,
  timeZone?: string,
): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;

  if (allDay || /T00:00:00/.test(iso)) {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      timeZone,
    });
  }

  return date.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone,
  });
}

function yyyymmdd(date = new Date()): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}${mm}${dd}`;
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function localIsoDate(date = new Date()): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function sortAndCap(items: RankedEvent[], limit: number): EventItem[] {
  return items
    .sort((a, b) => a.startMs - b.startMs)
    .slice(0, limit)
    .map(({ title, subtitle, badge, href }) => ({
      title,
      subtitle,
      badge,
      href,
    }));
}

export async function getTrumbaEvents(
  webname: string,
  days = 21,
  limit = 10,
): Promise<EventItem[]> {
  const params = new URLSearchParams({
    startdate: yyyymmdd(),
    days: String(days),
  });
  const url = `https://www.trumba.com/calendars/${encodeURIComponent(webname)}.json?${params}`;

  try {
    const response = await fetch(url, { next: { revalidate: 1800 } });
    if (!response.ok) return [];

    const events = (await response.json()) as Array<{
      eventID?: number;
      title?: string;
      location?: string;
      startDateTime?: string;
      canceled?: boolean;
      allDay?: boolean;
      permaLinkUrl?: string;
    }>;

    const items: RankedEvent[] = [];
    for (const event of events) {
      if (event.canceled || !event.title || !event.startDateTime) continue;
      const startMs = Date.parse(event.startDateTime);
      if (Number.isNaN(startMs)) continue;

      const location = event.location ? stripHtml(event.location) : "";
      const when = formatEventWhen(event.startDateTime, event.allDay);

      items.push({
        title: stripHtml(event.title),
        subtitle: location ? `${when} · ${location}` : when,
        badge: "Campus",
        href: event.permaLinkUrl,
        startMs,
      });
    }

    return sortAndCap(items, limit);
  } catch {
    return [];
  }
}

export async function getLocalistEvents(
  apiBase: string,
  days = 21,
  limit = 12,
): Promise<EventItem[]> {
  const base = apiBase.replace(/\/$/, "");
  const params = new URLSearchParams({
    days: String(days),
    pp: String(Math.min(limit, 50)),
  });
  const url = `${base}/api/2/events?${params}`;

  try {
    const response = await fetch(url, { next: { revalidate: 1800 } });
    if (!response.ok) return [];

    const data = (await response.json()) as {
      events?: Array<{
        event?: {
          title?: string;
          status?: string;
          location_name?: string;
          localist_url?: string;
          url?: string;
          event_instances?: Array<{
            event_instance?: {
              start?: string;
              all_day?: boolean;
            };
          }>;
        };
      }>;
    };

    const items: RankedEvent[] = [];
    for (const entry of data.events ?? []) {
      const event = entry.event;
      if (!event?.title || event.status === "canceled") continue;

      const instance = event.event_instances?.[0]?.event_instance;
      const start = instance?.start;
      if (!start) continue;
      const startMs = Date.parse(start);
      if (Number.isNaN(startMs)) continue;

      const when = formatEventWhen(start, instance?.all_day);
      const location = event.location_name?.trim();

      items.push({
        title: event.title,
        subtitle: location ? `${when} · ${location}` : when,
        badge: "GW",
        href: event.localist_url || event.url,
        startMs,
      });
    }

    return sortAndCap(items, limit);
  } catch {
    return [];
  }
}

function pickLocPlace(event: {
  location?: string | string[];
  location_campus?: string | string[];
}): string | undefined {
  const raw = event.location;
  const parts = (Array.isArray(raw) ? raw : raw ? [raw] : [])
    .map((p) => p.trim())
    .filter(Boolean);

  const skip = new Set([
    "in person",
    "online",
    "hybrid",
    "main campus",
    "all buildings",
  ]);
  const filtered = parts.filter((p) => !skip.has(p.toLowerCase()));

  const building = filtered.find((p) =>
    /building|theater|theatre|hall|gallery|convention|campus/i.test(p),
  );
  if (building) return building;

  const named = filtered.find((p) => !/^[a-z]?\d/i.test(p) && p.length > 2);
  if (named) return named;

  const campus = event.location_campus;
  if (Array.isArray(campus) && campus[0]?.trim()) return campus[0].trim();
  if (typeof campus === "string" && campus.trim()) return campus.trim();

  return "Library of Congress";
}

function parseLocStart(
  date: string,
  dates?: string[],
): { iso: string; allDay: boolean } | null {
  const range = dates?.[0];
  const rangeMatch = range?.match(
    /\[(\d{4}-\d{2}-\d{2}T[\d:.]+Z)\s+TO\s+(\d{4}-\d{2}-\d{2}T[\d:.]+Z)\]/,
  );
  if (rangeMatch) {
    return { iso: rangeMatch[1], allDay: false };
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  return { iso: `${date}T12:00:00`, allDay: true };
}

/**
 * Upcoming Library of Congress events (Capitol Hill / DC) via the keyless
 * loc.gov JSON search API. Not a full citywide calendar — LOC programming only.
 */
export async function getLocEvents(
  days = 21,
  limit = 10,
): Promise<EventItem[]> {
  const start = localIsoDate();
  const end = localIsoDate(addDays(new Date(), days));
  const params = new URLSearchParams({
    fo: "json",
    dates: `${start}/${end}`,
    c: String(Math.min(Math.max(limit * 3, 25), 100)),
  });
  const url = `https://www.loc.gov/events/?${params}`;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "thewitzel.family/1.0 (https://thewitzel.family; family site events)",
        Accept: "application/json",
      },
      next: { revalidate: 1800 },
    });
    if (!response.ok) return [];

    const data = (await response.json()) as {
      results?: Array<{
        title?: string;
        date?: string;
        dates?: string[];
        location?: string | string[];
        location_campus?: string | string[];
        url?: string;
      }>;
    };

    const items: RankedEvent[] = [];
    for (const event of data.results ?? []) {
      if (!event.title || !event.date) continue;
      if (event.date < start) continue;

      const parsed = parseLocStart(event.date, event.dates);
      if (!parsed) continue;
      const startMs = Date.parse(parsed.iso);
      if (Number.isNaN(startMs)) continue;

      const when = formatEventWhen(
        parsed.iso,
        parsed.allDay,
        "America/New_York",
      );
      const place = pickLocPlace(event);

      items.push({
        title: stripHtml(event.title),
        subtitle: place ? `${when} · ${place}` : when,
        badge: "DC",
        href: event.url || undefined,
        startMs,
      });
    }

    return sortAndCap(items, limit);
  } catch {
    return [];
  }
}
