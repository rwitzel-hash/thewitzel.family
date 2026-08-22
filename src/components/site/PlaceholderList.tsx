import type { PlaceholderItem } from "@/data/sites/types";

type PlaceholderListProps = {
  items: PlaceholderItem[];
  emptyMessage?: string;
};

export function PlaceholderList({
  items,
  emptyMessage = "Nothing loaded right now. Check back soon.",
}: PlaceholderListProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <p className="text-sm text-white/65">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {items.map((item) => {
        const body = (
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
        );

        return (
          <li key={`${item.title}-${item.subtitle ?? ""}-${item.href ?? ""}`}>
            {item.href ? (
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
              >
                {body}
              </a>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                {body}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
