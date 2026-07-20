import { ProjectCard } from "@/components/ProjectCard";
import { projects } from "@/data/projects";

export default function Home() {
  return (
    <div className="relative min-h-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[#0f0c29]" />
      <div className="pointer-events-none absolute -left-32 top-0 h-[500px] w-[500px] animate-blob rounded-full bg-purple-600/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-1/4 h-[450px] w-[450px] animate-blob animation-delay-2000 rounded-full bg-pink-500/35 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-[400px] w-[400px] animate-blob animation-delay-4000 rounded-full bg-cyan-500/30 blur-3xl" />

      <div className="pointer-events-none absolute inset-0 opacity-20">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="dots"
              x="0"
              y="0"
              width="32"
              height="32"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      <main className="relative mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-24">
        <header className="mb-16 text-center">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-sm font-medium text-white/80 backdrop-blur-sm">
            <span aria-hidden="true">🏡</span>
            Welcome home
          </p>
          <h1 className="font-display text-5xl font-extrabold tracking-tight text-white sm:text-7xl">
            The Witzel
            <span className="block bg-gradient-to-r from-pink-300 via-violet-300 to-cyan-300 bg-clip-text text-transparent">
              Family
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/70 sm:text-xl">
            Our little corner of the internet — projects, passions, and
            adventures. Pick a door and step inside.
          </p>
        </header>

        <section aria-label="Family projects">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">Explore</h2>
              <p className="mt-1 text-white/60">
                More spaces opening soon — stay tuned!
              </p>
            </div>
            <div className="hidden h-px flex-1 bg-gradient-to-r from-white/20 to-transparent sm:block" />
          </div>

          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {projects.map((project) => (
              <li key={project.name} className="list-none">
                <ProjectCard project={project} />
              </li>
            ))}
          </ul>
        </section>

        <footer className="mt-20 text-center text-sm text-white/40">
          <p>Made with love by the Witzel family</p>
          <p className="mt-1">thewitzel.family</p>
        </footer>
      </main>
    </div>
  );
}
