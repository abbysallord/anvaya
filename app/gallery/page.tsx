import type { Metadata } from "next";
import { FinalCTA, PageHero } from "../components/cinema/Shared";
import { breakthroughs } from "../lib/gallery";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Inside the Anvaya studio: made-to-measure carpentry, room-by-room ceilings and lighting, a real-material library and a walkthrough viewer built for every screen.",
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  return <main id="main-content" tabIndex={-1}>
    <PageHero title="Inside the studio."><p>The tools behind our walkthroughs, shown with what they make.</p></PageHero>
    <section className="section gallery-section"><div className="shell">
      <ol className="gallery-list">
        {breakthroughs.map((b, i) => <li key={b.id} id={b.id} className="gallery-item">
          <figure>
            <div className="gallery-shot"><img src={b.image} width={b.w} height={b.h} alt={b.alt} loading={i < 2 ? "eager" : "lazy"} decoding="async" /></div>
            <figcaption>
              <p className="gallery-tag">{String(i + 1).padStart(2, "0")} · {b.tag}</p>
              <h2 className="gallery-title" data-nosplit>{b.title}</h2>
              <p>{b.body}</p>
            </figcaption>
          </figure>
        </li>)}
      </ol>
    </div></section>
    <FinalCTA heading="Want this for your project?" body="Send us a floor plan. We reply with a scope, a price and a delivery date." action="Start a project" direct />
  </main>;
}
