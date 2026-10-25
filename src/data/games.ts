export type FamilyGame = {
  name: string;
  href: string;
  blurb: string;
};

export const gamesHomeUrl = "https://games.thewitzel.family";

/**
 * The game the home tile calls newest.
 * This entry is the source of truth — do not infer it from catalog order.
 * Point it at the next title (Maple Hollow is expected soon) when that game ships.
 */
export const featuredGame: FamilyGame = {
  name: "Family Hold'em",
  href: `${gamesHomeUrl}/games/poker`,
  blurb:
    "No-Limit Texas Hold'em with pretend chips — read the board, name your hand, and play the table.",
};
