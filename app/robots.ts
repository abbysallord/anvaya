import type { MetadataRoute } from "next";
import { siteUrl } from "./lib/site";

export const dynamic = "force-static";
const site = siteUrl + (process.env.NEXT_PUBLIC_BASE_PATH || "");

/** Search and AI-answer crawlers are named explicitly so the site can be cited by Google, ChatGPT, Claude and
    Perplexity. Model-training crawlers are not blocked either: there is nothing private here. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: ["Googlebot", "Bingbot", "OAI-SearchBot", "ChatGPT-User", "Claude-SearchBot", "Claude-User", "PerplexityBot"], allow: "/" },
    ],
    sitemap: `${site}/sitemap.xml`,
    host: site,
  };
}
