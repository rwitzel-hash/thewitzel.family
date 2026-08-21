export type LunchDay = {
  date: string;
  items: string[];
  isToday: boolean;
};

export type LunchWeek = {
  startDate: string;
  days: LunchDay[];
};

type NutrisliceMenuItem = {
  text?: string;
  food?: {
    name?: string;
    food_category?: string;
  } | null;
  is_section_title?: boolean;
};

type NutrisliceDay = {
  date: string;
  menu_items?: NutrisliceMenuItem[];
};

function todayInTimezone(timezone: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function parseDayItems(items: NutrisliceMenuItem[]): string[] {
  const entrees: string[] = [];
  const sides: string[] = [];

  for (const item of items) {
    if (item.is_section_title) continue;
    const name = item.food?.name?.trim() || item.text?.trim();
    if (!name) continue;

    if (item.food?.food_category === "entree") {
      entrees.push(name);
    } else {
      sides.push(name);
    }
  }

  const unique = [...new Set([...entrees, ...sides])];
  return unique.slice(0, 8);
}

export async function getLunchWeek(options: {
  district: string;
  school: string;
  menuType: string;
  date?: Date;
  timezone?: string;
}): Promise<LunchWeek | null> {
  const date = options.date ?? new Date();
  const timezone = options.timezone ?? "America/Denver";
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const today = todayInTimezone(timezone);

  const url =
    `https://${options.district}.api.nutrislice.com/menu/api/weeks/school/` +
    `${options.school}/menu-type/${options.menuType}/${yyyy}/${mm}/${dd}/`;

  try {
    const response = await fetch(url, { next: { revalidate: 1800 } });
    if (!response.ok) return null;

    const data = (await response.json()) as {
      start_date?: string;
      days?: NutrisliceDay[];
    };

    const days: LunchDay[] = (data.days ?? []).map((day) => ({
      date: day.date,
      items: parseDayItems(day.menu_items ?? []),
      isToday: day.date === today,
    }));

    return {
      startDate: data.start_date ?? `${yyyy}-${mm}-${dd}`,
      days,
    };
  } catch {
    return null;
  }
}
