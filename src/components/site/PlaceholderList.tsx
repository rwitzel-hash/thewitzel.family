import type { PlaceholderItem } from "@/data/sites/types";

type PlaceholderListProps = {
  items: PlaceholderItem[];
};

export function PlaceholderList({ items }: PlaceholderListProps) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li
          key={item.title}
          className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold text-white">{item.title}</h3>
              {item.subtitle && (
                <p className="mt-1 text-sm text-white/65">{item.subtitle}</p>
              )}
            </div>
            {item.badge && (
              <span className="shrink-0 rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white/80">
                {item.badge}
              </span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
