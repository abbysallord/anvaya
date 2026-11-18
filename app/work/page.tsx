import type { Metadata } from "next";
import { FinalCTA, PageHero } from "../components/cinema/Shared";
import { Showcase } from "../components/site/Showcase";
import { westRoad } from "../lib/site";

export const metadata: Metadata = {
  title: "Work",
  description: "Walk through Anvaya's 360° home walkthroughs on any phone or laptop: a 3BHK with a made-to-measure puja unit and a space-saving city 2BHK.",
  alternates: { canonical: "/work" },
};

// Studio samples lead; client work appears only as delivered and with permission.
export default function WorkPage() {
  return <main id="main-content" tabIndex={-1}>
    <PageHero title="Our work."><p>Open any walkthrough and explore it the way a buyer would, on a phone or a laptop.</p></PageHero>
    <Showcase number="01" />
    <section className="section work-section" id="client-work" aria-labelledby="client-work-title"><div className="wrap">
      <p className="label" id="client-work-title"><b>02</b> / Client walkthroughs</p>
      <ul className="client-list">
        <li>
          <a href={westRoad.tour} target="_blank" rel="noopener noreferrer" className="client-row">
            <span className="client-name">{westRoad.name}</span>
            <span className="client-kind">{westRoad.kind}</span>
            <span className="client-open" aria-hidden="true">Open ↗</span>
          </a>
        </li>
      </ul>
      <p className="work-note">More client projects will appear here as clients approve them.</p>
    </div></section>
    <FinalCTA heading="Want this for your project?" body="Send us a floor plan. We reply with a scope, a price and a delivery date, and your walkthrough goes live as a link you can share anywhere." action="Start a project" direct />
  </main>;
}
