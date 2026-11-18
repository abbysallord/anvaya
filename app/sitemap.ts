import type { MetadataRoute } from "next";
import { practices, siteUrl } from "./lib/site";
import { posts } from "./lib/posts";

// Static so the GitHub Pages export can include it.
export const dynamic = "force-static";

const site = siteUrl + (process.env.NEXT_PUBLIC_BASE_PATH || "");
// /about redirects to /studio, so it is not listed.
const pages: [string, number][] = [["/", 1], ["/pricing", .9], ["/work", .9], ["/gallery", .8], ["/services", .8], ["/project", .8], ["/blog", .6], ["/studio", .6], ["/terms", .3], ["/privacy", .3], ["/credits", .3]];

/** Every public page; service pages use their slugs (the id aliases point at the same content). */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...pages.map(([path, priority]) => ({ url: site + path, changeFrequency: "monthly" as const, priority })),
    ...practices.filter(p => !p.comingSoon).map(p => ({ url: `${site}/services/${p.slug}`, changeFrequency: "monthly" as const, priority: .7 })),
    ...posts.map(p => ({ url: `${site}/blog/${p.slug}`, lastModified: p.date, changeFrequency: "yearly" as const, priority: .5 })),
  ];
}
