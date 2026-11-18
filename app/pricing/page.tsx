import type { Metadata } from "next";
import Link from "next/link";
import { Bundles } from "../components/site/Bundles";
import { FinalCTA, PageHero, PricingAddOns, PricingPlans, QuotedServices, TermsGrid } from "../components/cinema/Shared";

export const metadata: Metadata = {
  title: "Bundles and pricing",
  description: "Anvaya bundle prices: launch kits for real estate developers from $1,500 and growth bundles for businesses from $600, in US dollars with an INR view, with individual 3D items, add-ons, timelines and terms.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return <main id="main-content" tabIndex={-1}>
    <PageHero title="Bundles and pricing." action="Start a project"><p>One price for everything a launch needs. Each bundle costs less than its parts bought separately, with a set delivery time and two rounds of changes. Prices are in US dollars; switch to INR below.</p></PageHero>
    <Bundles path />
    <section className="section pricing-section" id="plans"><div className="wrap">
      <div className="section-heading"><h2>Only need <em>the visuals?</em></h2><p>Individual 3D items, priced per unit type. Try one room free before you order: one watermarked sample per developer.</p></div>
      <PricingPlans />
    </div></section>
    <section className="section pricing-section" id="add-ons"><div className="wrap">
      <div className="section-heading"><h2>Add <em>what you need.</em></h2><p>Extras that work with any bundle or item.</p></div>
      <PricingAddOns />
    </div></section>
    <section className="section pricing-section" id="quoted"><div className="wrap">
      <div className="section-heading"><h2>One piece <em>at a time.</em></h2><p>The parts of a bundle, quoted on their own after a short call. Prices are starting points.</p></div>
      <QuotedServices />
    </div></section>
    <section className="section pricing-section" id="terms"><div className="wrap">
      <div className="section-heading"><h2>The terms, <em>in plain words.</em></h2><p>The same for every client. The full version is in the <Link href="/terms">project terms</Link>.</p></div>
      <TermsGrid />
    </div></section>
    <FinalCTA heading="Not sure which bundle fits?" body="Tell us about the project in a few lines. We reply with the bundle that fits, a price and a date." />
  </main>;
}
