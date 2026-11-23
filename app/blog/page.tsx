import type { Metadata } from "next";
import Link from "next/link";
import { FinalCTA, PageHero } from "../components/cinema/Shared";
import { posts } from "../lib/posts";

export const metadata: Metadata = { title: "News and notes", description: "Studio news and practical notes from Anvaya on walkthroughs, interiors and building for every screen.", alternates: { canonical: "/blog" } };

const fmt = (d: string) => new Date(d + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export default function BlogPage() {
  return <main id="main-content" tabIndex={-1}>
    <PageHero title="News and notes."><p>What we are building, and how.</p></PageHero>
    <section className="section"><div className="shell">
      <ul className="post-list">
        {posts.map(p => <li key={p.slug}><Link href={`/blog/${p.slug}`} className="post-row">
          <span className="post-meta"><span>{p.kind}</span><time dateTime={p.date}>{fmt(p.date)}</time></span>
          <span className="post-title">{p.title}</span>
          <span className="post-summary">{p.summary}</span>
        </Link></li>)}
      </ul>
    </div></section>
    <FinalCTA />
  </main>;
}
