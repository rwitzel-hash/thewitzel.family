import { Geist } from "next/font/google";
import { BridgeBackground } from "@/components/home/BridgeBackground";
import { ClockTile } from "@/components/home/ClockTile";
import {
  GamesTile,
  PersonTile,
  RideTile,
  SoonTile,
  WeatherTile,
} from "@/components/home/DashboardTiles";
import { HomeStage } from "@/components/home/HomeStage";
import { projects, type Project } from "@/data/projects";
import { getHomeData } from "@/lib/home";

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
});

export const revalidate = 1800;

const memberOrder = ["Paul", "Vee", "Gabby", "Heidi"];

function byMemberOrder(a: Project, b: Project): number {
  const ai = memberOrder.indexOf(a.name);
  const bi = memberOrder.indexOf(b.name);
  return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
}

export default async function Home() {
  const data = await getHomeData();
  const ride =
    projects.find((project) => project.name === "Ride") ?? projects[0];
  const rest = projects.filter((project) => project.name !== "Ride");
  const members = rest
    .filter((project) => !project.comingSoon)
    .sort(byMemberOrder);
  const comingSoon = rest.filter((project) => project.comingSoon);

  return (
    <HomeStage className={geist.className}>
      <BridgeBackground />
      <main className="relative z-10 mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 sm:py-10 lg:px-10 xl:max-w-[1680px] 2xl:max-w-[1840px] 2xl:py-14">
        <header className="mb-6 flex items-start justify-between gap-4 sm:mb-8">
          <div>
            <h1 className="home-title text-[clamp(2.5rem,6vw,5.4rem)] font-semibold leading-[0.92] tracking-[-0.045em] text-white">
              The Witzel Family
            </h1>
            <p className="home-title mt-3 text-xs font-medium uppercase tracking-[0.28em] text-white/80 sm:text-sm">
              Live. Together. Always.
            </p>
          </div>
          <p className="mt-1 inline-flex shrink-0 items-center gap-2 rounded-full border border-white/20 bg-black/55 px-3.5 py-1.5 text-sm font-medium text-white shadow-lg backdrop-blur-md">
            <span className="live-dot size-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]" />
            Live
          </p>
        </header>

        <section aria-label="Family dashboard" className="grid grid-cols-1 gap-3 lg:grid-cols-12 lg:gap-4">
          {ride ? <RideTile project={ride} /> : null}
          <GamesTile
            total={data.games.total}
            newestName={data.games.newestName}
            newestBlurb={data.games.newestBlurb}
            newestHref={data.games.newestHref}
            live={data.games.live}
          />
          <div className="grid grid-cols-2 gap-3 lg:col-span-5 lg:gap-4">
            <WeatherTile weather={data.weather} />
            <ClockTile />
          </div>
        </section>

        <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:mt-4 lg:grid-cols-4 lg:gap-4">
          {members.map((project) => (
            <li key={project.name} className="list-none">
              <PersonTile project={project} note={data.notes[project.name]} />
            </li>
          ))}
        </ul>

        {comingSoon.length > 0 ? (
          <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:mt-4 lg:gap-4">
            {comingSoon.map((project) => (
              <li key={project.name} className="list-none">
                <SoonTile project={project} />
              </li>
            ))}
          </ul>
        ) : null}

        <footer className="home-title mt-10 text-center text-xs tracking-[0.18em] text-white/70 uppercase">
          thewitzel.family
        </footer>
      </main>
    </HomeStage>
  );
}
