import type { Metadata } from "next";
import { Action, FinalCTA, PageHero, ServiceBlocks } from "../components/cinema/Shared";

export const metadata: Metadata = { title: "Capabilities", description: "The three crafts behind every Anvaya bundle: websites and branding, AI and WhatsApp automation, and 3D renders and walkthroughs.", alternates: { canonical: "/services" } };
export default function ServicesPage() {
  return <main id="main-content" tabIndex={-1}>
    <PageHero title="Capabilities." action="Start a project"><p>Three crafts under one roof. Most clients buy them together as a bundle; each is also available on its own.</p></PageHero>
    <section className="section build-section" id="practices" data-rail="Our practices"><div className="wrap"><div className="capabilities-heading"><h2>Three crafts. One team.</h2><p>Each works on its own. Together they make a launch kit: the visuals, the website and the follow-up.</p></div><ServiceBlocks /></div></section>
    <section className="section connection-section" id="connect" data-rail="How they connect"><div className="wrap"><div className="connection-grid"><h2>Not sure what you need? Tell us the problem.</h2><div className="section-copy"><p>A new website may also need a logo and WhatsApp replies. A building project may need 3D renders, a project site and follow-up for every enquiry.</p><p>Our bundles cover the common cases at one price. Anything else is scoped with you.</p><Action href="/project" text>Tell us what you need</Action></div></div></div></section>
    <section className="section working-section" id="working-model" data-rail="Working model"><div className="wrap"><h2>Three ways <em>to work with us.</em></h2><div className="working-model"><div><span aria-hidden="true">01</span><h3>A bundle</h3><p>One price for everything a launch or a growing business needs.</p></div><div><span aria-hidden="true">02</span><h3>One craft</h3><p>For a single, clear need, like a new website or a set of renders.</p></div><div><span aria-hidden="true">03</span><h3>Monthly care</h3><p>Follow-up, hosting and edits that keep working after launch.</p></div></div></div></section>
    <FinalCTA />
  </main>;
}
