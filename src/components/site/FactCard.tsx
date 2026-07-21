import { SectionCard } from "./SectionCard";

type FactCardProps = {
  title: string;
  description: string;
  emoji: string;
  fact: string;
};

export function FactCard({ title, description, emoji, fact }: FactCardProps) {
  return (
    <SectionCard title={title} description={description}>
      <div className="flex gap-4 rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-5">
        <span className="text-4xl" aria-hidden="true">
          {emoji}
        </span>
        <p className="text-base leading-relaxed text-white/85">{fact}</p>
      </div>
    </SectionCard>
  );
}
