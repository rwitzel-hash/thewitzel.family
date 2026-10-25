import { Fredoka, Nunito } from "next/font/google";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
});

export default function SitesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${nunito.variable} ${fredoka.variable} member-site flex min-h-full flex-1 flex-col`}
    >
      {children}
    </div>
  );
}
