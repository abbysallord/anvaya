import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "./components/cinema/Hero";
import { Showcase } from "./components/site/Showcase";
import { Journey } from "./components/site/Journey";
import { Bundles } from "./components/site/Bundles";
import { ArrowUpRight } from "./components/site/icons";
import { Faq, FinalCTA } from "./components/cinema/Shared";
import { practices } from "./lib/site";

export const metadata: Metadata = {
  title: { absolute: "Anvaya — Launch kits for real estate developers and growing businesses" },
  description: "Anvaya builds end-to-end launch kits: 360° walkthroughs, project websites and WhatsApp follow-up for real estate developers, and website-plus-booking bundles for clinics, schools and shops.",
  alternates: { canonical: "/" },
};

// Every answer restates the published bundles and terms; nothing here adds a new commitment.
const questions = [
  ["What is a launch kit?", <p key="a">One package for one residential launch: a 360° walkthrough of the flat, a project website and WhatsApp follow-up for every enquiry. One team builds all three, so they work together from day one.</p>],
  ["We only have floor plans. Is that enough?", <p key="a">Yes. Send the approved floor plan and any elevation or finish references you have. We model, furnish and light the flat from that, and you review it twice before it goes live.</p>],
  ["How long does it take?", <p key="a">Launch Essential is delivered in 10 working days and Launch Pro in 15. Larger projects are scheduled with you before work starts.</p>],
  ["How do payments work?", <p key="a">50% advance to start and the balance before final files, by international bank transfer (UPI or bank transfer in India). Prices are in US dollars; quotes are also available in EUR, GBP, AED or INR. Previews carry a watermark until paid. The full details are in the <Link href="/terms">project terms</Link>.</p>],
  ["Do you work with businesses outside real estate?", <p key="a">Yes. Get Found and Get Booked are bundles for clinics, schools, studios and shops: a fast website, a tuned Google profile and WhatsApp replies and booking. See <Link href="/pricing#businesses">growth bundles</Link>.</p>],
  ["Do you work with clients outside India?", <p key="a">Yes. We work remotely with developers, designers and brokers worldwide, in English, across time zones. Floor plans in PDF, DWG or image form are fine, in metres or feet.</p>],
  ["Will our plans stay confidential?", <p key="a">Yes. Your plans and renders are never shown to anyone without your written permission, and we sign an NDA on request at no cost.</p>],
] as const;

export default function Home() {
  const open = practices.filter(p => !p.comingSoon);
  return <main id="main-content" tabIndex={-1}>
    <Hero />
    <Showcase number="01" />

    <section className="caps" id="what-we-build" aria-labelledby="caps-title"><div className="shell">
      <div className="caps-head">
        <p className="label"><b>02</b> / What we do</p>
        <h2 id="caps-title" className="display">Three crafts, <em>one team.</em></h2>
        <p className="lede">We build websites, WhatsApp automation and 3D walkthroughs, and sell them together as bundles so they work as one system.</p>
      </div>
      <ul className="caps-list" data-stagger="80">
        {open.map((p, i) => <li key={p.id}><Link href={`/services/${p.slug}`} className="caps-row">
          <span className="caps-index">{String(i + 1).padStart(2, "0")}</span>
          <span className="caps-name">{p.name}</span>
          <span className="caps-line">{p.line}</span>
          <ArrowUpRight />
        </Link></li>)}
      </ul>
    </div></section>

    <Journey />
    <Bundles number="04" />

    <section className="section faq-section" id="faq"><div className="shell">
      <div className="faq-layout"><div><p className="label"><b>05</b> / Questions</p><h2 className="display">Before you <em>start.</em></h2></div><Faq items={questions} /></div>
    </div></section>

    <FinalCTA heading="Have a launch coming up?" body="Send us a floor plan or a few lines about your business. We reply with the bundle that fits, a price and a date." action="Start a project" direct />
  </main>;
}
