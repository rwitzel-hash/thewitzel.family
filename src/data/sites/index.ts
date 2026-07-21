import { gabbySite } from "./gabby";
import { heidiSite } from "./heidi";
import { paulSite } from "./paul";
import type { SiteConfig } from "./types";
import { veeSite } from "./vee";

export const sites: SiteConfig[] = [paulSite, veeSite, gabbySite, heidiSite];

export const sitesBySlug: Record<string, SiteConfig> = Object.fromEntries(
  sites.map((site) => [site.slug, site]),
);

export const siteSlugs = sites.map((site) => site.slug);
