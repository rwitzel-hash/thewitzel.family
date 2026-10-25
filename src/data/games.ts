export type FamilyGame = {
  name: string;
  href: string;
  blurb: string;
};

export const gamesHomeUrl = "https://games.thewitzel.family";

/**
 * Used only when the games site cannot be read.
 * Family Hold'em is last on purpose: it is the newest title this list knows about.
 * A successful read of the games homepage replaces this shelf.
 */
export const fallbackGames: FamilyGame[] = [
  {
    name: "Family Wordle",
    href: `${gamesHomeUrl}/games/wordle`,
    blurb:
      "Guess today's 5-letter word in six tries — same puzzle for the whole family.",
  },
  {
    name: "Memory Match",
    href: `${gamesHomeUrl}/games/memory`,
    blurb: "Flip cards and find matching pairs.",
  },
  {
    name: "Family Hold'em",
    href: `${gamesHomeUrl}/games/poker`,
    blurb:
      "No-Limit Texas Hold'em with pretend chips — read the board, name your hand, and play the table.",
  },
];
