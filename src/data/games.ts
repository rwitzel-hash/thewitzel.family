export type FamilyGame = {
  name: string;
  href: string;
  blurb: string;
};

export const gamesHomeUrl = "https://games.thewitzel.family";

/**
 * The game the home tile calls newest.
 * This entry is the source of truth — do not infer it from catalog order.
 * Path matches the live catalog: https://games.thewitzel.family/games/maple-hollow
 */
export const featuredGame: FamilyGame = {
  name: "Maple Hollow",
  href: `${gamesHomeUrl}/games/maple-hollow`,
  blurb:
    "A 3D town — create a character, claim and decorate a house, drive cars and emergency vehicles, and work jobs for coins.",
};
