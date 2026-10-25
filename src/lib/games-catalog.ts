import { fallbackGames, gamesHomeUrl, type FamilyGame } from "@/data/games";

const GAME_PATTERN =
  /href="(\/games\/[a-z0-9-]+)"[\s\S]{0,1200}?<h2[^>]*>([^<]{1,80})<\/h2>[\s\S]{0,500}?<p[^>]*>([^<]{0,280})<\/p>/gi;

function decodeHtml(value: string): string {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) =>
      String.fromCodePoint(Number.parseInt(hex, 16)),
    )
    .replace(/&#(\d+);/g, (_, num: string) =>
      String.fromCodePoint(Number.parseInt(num, 10)),
    )
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

export function parseGamesCatalog(html: string): FamilyGame[] {
  GAME_PATTERN.lastIndex = 0;
  const games: FamilyGame[] = [];
  const seen = new Set<string>();

  for (const match of html.matchAll(GAME_PATTERN)) {
    const path = match[1];
    const name = decodeHtml(match[2] ?? "");
    const blurb = decodeHtml(match[3] ?? "");
    if (!name || seen.has(path)) continue;
    seen.add(path);
    games.push({
      name,
      href: `${gamesHomeUrl}${path}`,
      blurb,
    });
    if (games.length >= 40) break;
  }

  return games;
}

/** Public catalog from the games homepage. Falls back to the local shelf. */
export async function getGamesCatalog(): Promise<{
  games: FamilyGame[];
  live: boolean;
}> {
  try {
    const response = await fetch(gamesHomeUrl, {
      headers: { Accept: "text/html" },
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return { games: fallbackGames, live: false };

    const games = parseGamesCatalog(await response.text());
    if (games.length === 0) return { games: fallbackGames, live: false };
    return { games, live: true };
  } catch {
    return { games: fallbackGames, live: false };
  }
}
