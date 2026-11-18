import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FinalCTA } from "../../components/cinema/Shared";
import { postBySlug, posts } from "../../lib/posts";

export const dynamicParams = false;
export function generateStaticParams() { return posts.map(p => ({ slug: p.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = postBySlug((await params).slug);
  return p ? { title: p.title, description: p.summary, alternates: { canonical: `/blog/${p.slug}` } } : {};
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = postBySlug((await params).slug);
  if (!p) notFound();
  const date = new Date(p.date + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  return <main id="main-content" tabIndex={-1}>
    <article className="wrap post">
      <p className="post-meta"><Link href="/blog">News and notes</Link><span>{p.kind}</span><time dateTime={p.date}>{date}</time></p>
      <h1 className="post-heading">{p.title}</h1>
      <p className="post-lede">{p.summary}</p>
      {p.body.map((para, i) => <p key={i}>{para}</p>)}
      <p className="post-byline">The Anvaya team</p>
    </article>
    <FinalCTA />
  </main>;
}
