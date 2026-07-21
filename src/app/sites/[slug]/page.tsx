import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteSections } from "@/components/site/SiteSections";
import { SiteShell } from "@/components/site/SiteShell";
import { siteSlugs, sitesBySlug } from "@/data/sites";

type SitePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return siteSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: SitePageProps): Promise<Metadata> {
  const { slug } = await params;
  const site = sitesBySlug[slug];

  if (!site) {
    return { title: "Not found" };
  }

  return {
    title: `${site.name} · The Witzel Family`,
    description: site.tagline,
    openGraph: {
      title: `${site.name} · The Witzel Family`,
      description: site.tagline,
      url: `https://${site.slug}.thewitzel.family`,
      siteName: "The Witzel Family",
      type: "website",
    },
  };
}

export default async function SitePage({ params }: SitePageProps) {
  const { slug } = await params;
  const site = sitesBySlug[slug];

  if (!site) {
    notFound();
  }

  const seed = `${slug}:${new Date().toISOString().slice(0, 10)}`;

  return (
    <SiteShell site={site}>
      <SiteSections sections={site.sections} seed={seed} />
    </SiteShell>
  );
}
