export type Project = {
  name: string;
  description: string;
  href?: string;
  emoji: string;
  gradient: string;
  comingSoon?: boolean;
};

export const projects: Project[] = [
  {
    name: "Ride",
    description: "Family rides, routes, and adventures on two wheels.",
    href: "https://ride.thewitzel.family",
    emoji: "🚴",
    gradient: "from-emerald-400 via-teal-500 to-cyan-500",
  },
  {
    name: "Schedule",
    description: "Shared calendar for the whole crew.",
    emoji: "📅",
    gradient: "from-violet-400 via-purple-500 to-fuchsia-500",
    comingSoon: true,
  },
  {
    name: "Heidi",
    description: "Heidi's corner of the internet.",
    emoji: "✨",
    gradient: "from-pink-400 via-rose-500 to-red-400",
    comingSoon: true,
  },
  {
    name: "Gabby",
    description: "Gabby's projects and passions.",
    emoji: "🎨",
    gradient: "from-amber-400 via-orange-500 to-red-500",
    comingSoon: true,
  },
  {
    name: "Paul",
    description: "Paul's workspace and ideas.",
    emoji: "🔧",
    gradient: "from-slate-400 via-zinc-500 to-stone-600",
    comingSoon: true,
  },
  {
    name: "Vee",
    description: "Vee's spot — coming soon.",
    emoji: "🌟",
    gradient: "from-yellow-300 via-amber-400 to-orange-400",
    comingSoon: true,
  },
  {
    name: "Alysha",
    description: "Alysha's creative space.",
    emoji: "🌸",
    gradient: "from-sky-400 via-blue-500 to-indigo-500",
    comingSoon: true,
  },
  {
    name: "Gardening",
    description: "Seeds, sprouts, and green-thumb goals.",
    emoji: "🌱",
    gradient: "from-lime-400 via-green-500 to-emerald-600",
    comingSoon: true,
  },
];
