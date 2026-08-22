export type MovieItem = {
  title: string;
  subtitle?: string;
  badge?: string;
  href?: string;
};

const MONTHS: Record<string, number> = {
  january: 1,
  february: 2,
  march: 3,
  april: 4,
  may: 5,
  june: 6,
  july: 7,
  august: 8,
  september: 9,
  october: 10,
  november: 11,
  december: 12,
};

const WIKI_UA =
  "thewitzel.family/1.0 (https://thewitzel.family; family site movies)";

function formatReleaseDate(date: string): string {
  if (!date) return "";
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function isoDate(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function wikiTitleHref(pageTitle: string): string {
  return `https://en.wikipedia.org/wiki/${pageTitle.replace(/ /g, "_")}`;
}

type ParsedFilm = {
  title: string;
  releaseDate: string;
  pageTitle?: string;
};

function parseAmericanFilmsWikitext(
  wikitext: string,
  year: number,
  fromIso: string,
  toIso: string,
): ParsedFilm[] {
  let month: number | null = null;
  let day: number | null = null;
  const films: ParsedFilm[] = [];

  for (const line of wikitext.split("\n")) {
    const monthMatch = line.match(/aria-label="([A-Za-z]+)"/);
    if (monthMatch && line.includes("data-sort-value")) {
      const key = monthMatch[1].toLowerCase();
      if (key in MONTHS) {
        month = MONTHS[key];
        day = null;
        continue;
      }
    }

    // Day cells are style/rowspan rows with bold day numbers and no wiki links.
    if (!line.includes("[[")) {
      const dayMatch = line.match(/'''(\d{1,2})'''/);
      if (dayMatch) {
        day = Number(dayMatch[1]);
        continue;
      }
    }

    if (month == null || day == null) continue;

    const linked: Array<{ title: string; pageTitle: string }> = [];
    const linkedRe = /''\[\[([^\]|]+)(?:\|([^\]]+))?\]\]''/g;
    let match: RegExpExecArray | null;
    while ((match = linkedRe.exec(line)) !== null) {
      linked.push({
        pageTitle: match[1],
        title: match[2] || match[1],
      });
    }

    const titles =
      linked.length > 0
        ? linked
        : (() => {
            const plain = line.match(/^\|\s*''([^'[\]]+)''\s*\|\|/);
            return plain
              ? [{ title: plain[1].trim(), pageTitle: undefined as string | undefined }]
              : [];
          })();

    if (titles.length === 0) continue;

    const releaseDate = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    if (releaseDate < fromIso || releaseDate > toIso) continue;

    for (const film of titles) {
      films.push({
        title: film.title,
        releaseDate,
        pageTitle: film.pageTitle,
      });
    }
  }

  return films;
}

async function fetchAmericanFilmsPage(year: number): Promise<string | null> {
  const params = new URLSearchParams({
    action: "parse",
    page: `List_of_American_films_of_${year}`,
    prop: "wikitext",
    format: "json",
    formatversion: "2",
  });
  const url = `https://en.wikipedia.org/w/api.php?${params}`;

  const response = await fetch(url, {
    headers: { "User-Agent": WIKI_UA, Accept: "application/json" },
    next: { revalidate: 1800 },
  });
  if (!response.ok) return null;

  const data = (await response.json()) as {
    parse?: { wikitext?: string };
    error?: unknown;
  };
  return data.parse?.wikitext ?? null;
}

/**
 * Upcoming US theatrical (and some streaming) releases from Wikipedia’s
 * “List of American films of YYYY” via the keyless MediaWiki API.
 * Coverage follows community-edited release schedules — dates can shift.
 */
export async function getUpcomingMovies(options: {
  region?: string;
  limit?: number;
  /** How far ahead to look (days). Default 60. */
  days?: number;
} = {}): Promise<MovieItem[]> {
  const limit = options.limit ?? 10;
  const days = options.days ?? 60;
  const today = new Date();
  const from = new Date(today);
  from.setHours(12, 0, 0, 0);
  const to = new Date(from);
  to.setDate(to.getDate() + days);

  const fromIso = isoDate(from);
  const toIso = isoDate(to);
  const years = new Set<number>([from.getFullYear(), to.getFullYear()]);

  try {
    const films: ParsedFilm[] = [];
    for (const year of years) {
      const wikitext = await fetchAmericanFilmsPage(year);
      if (!wikitext) continue;
      films.push(...parseAmericanFilmsWikitext(wikitext, year, fromIso, toIso));
    }

    const seen = new Set<string>();
    const items: MovieItem[] = [];
    for (const film of films.sort((a, b) =>
      a.releaseDate.localeCompare(b.releaseDate),
    )) {
      const key = film.title.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      items.push({
        title: film.title,
        subtitle: formatReleaseDate(film.releaseDate),
        badge: "Theater",
        href: film.pageTitle ? wikiTitleHref(film.pageTitle) : undefined,
      });
      if (items.length >= limit) break;
    }

    return items;
  } catch {
    return [];
  }
}
