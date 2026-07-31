export type LunchDay = {
  date: string;
  items: string[];
};

export type LunchWeek = {
  startDate: string;
  days: LunchDay[];
};

type NutrisliceMenuItem = {
  text?: string;
  food?: { name?: string } | null;
  is_section_title?: boolean;
};

type NutrisliceDay = {
  date: string;
  menu_items?: NutrisliceMenuItem[];
};

function itemName(item: NutrisliceMenuItem): string | null {
  if (item.is_section_title) return null;
  const name = item.food?.name?.trim() || item.text?.trim();
  return name || null;
}

export async function getLunchWeek(options: {
  district: string;
  school: string;
  menuType: string;
  date?: Date;
}): Promise<LunchWeek | null> {
  const date = options.date ?? new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");

  const url =
    `https://${options.district}.api.nutrislice.com/menu/api/weeks/school/` +
    `${options.school}/menu-type/${options.menuType}/${yyyy}/${mm}/${dd}/`;

  try {
    const response = await fetch(url, { next: { revalidate: 3600 } });
    if (!response.ok) return null;

    const data = (await response.json()) as {
      start_date?: string;
      days?: NutrisliceDay[];
    };

    const days: LunchDay[] = (data.days ?? []).map((day) => {
      const names = (day.menu_items ?? [])
        .map(itemName)
        .filter((name): name is string => Boolean(name));

      // Prefer entrees / unique names; keep first 6 for readability
      const unique = [...new Set(names)].slice(0, 6);
      return { date: day.date, items: unique };
    });

    return {
      startDate: data.start_date ?? `${yyyy}-${mm}-${dd}`,
      days,
    };
  } catch {
    return null;
  }
}
