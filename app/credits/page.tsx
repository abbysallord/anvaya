import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "../components/cinema/Shared";
import { credits } from "../lib/credits";

export const metadata: Metadata = {
  title: "Licences and credits",
  description: "Third-party 3D models, materials, artwork and fonts used in Anvaya's studio samples and website, with the credit each licence requires.",
  alternates: { canonical: "/credits" },
};

export default function CreditsPage() {
  return <main id="main-content" tabIndex={-1}>
    <PageHero title="Licences and credits."><p>Our renders use some third-party models, materials and artwork alongside our own. Each is used under its licence, and the credits it asks for are below.</p></PageHero>
    <section className="section policy-content"><div className="wrap">
      <section>
        <h2>Creative Commons Attribution (CC BY 4.0) models, via Sketchfab</h2>
        <ul>{credits.sketchfab.map(([what, who]) => <li key={what}>&ldquo;{what}&rdquo; by {who}, <a href="https://creativecommons.org/licenses/by/4.0/" rel="noopener noreferrer" target="_blank">CC BY 4.0</a></li>)}</ul>
      </section>
      <section>
        <h2>Amazon Berkeley Objects (CC BY 4.0)</h2>
        <p>{credits.abo}</p>
      </section>
      <section>
        <h2>Royalty-free models, via BlenderKit</h2>
        <ul>{credits.blenderkit.map(([what, who]) => <li key={what}>{what}, by {who}</li>)}</ul>
      </section>
      <section>
        <h2>Public domain (CC0) assets</h2>
        <ul>{credits.cc0.map(([src, what, url]) => <li key={src}><a href={url} rel="noopener noreferrer" target="_blank">{src}</a>: {what}</li>)}</ul>
      </section>
      <section>
        <h2>Public-domain artwork</h2>
        <ul>{credits.publicDomain.map(([what, who]) => <li key={what}>&ldquo;{what}&rdquo; by {who}</li>)}</ul>
      </section>
      <section>
        <h2>Fonts (SIL Open Font License 1.1)</h2>
        <ul>{credits.fonts.map(([what, who]) => <li key={what}>{what}, by {who}</li>)}</ul>
      </section>
      <section>
        <h2>Made by Anvaya</h2>
        <p>Made-to-measure carpentry, false ceilings and lighting, studio-modelled furniture and the 360° viewer are designed and built by the Anvaya team.</p>
        <p>Something credited wrongly or missing? Tell us through the <Link href="/project">project form</Link> and we will correct it.</p>
      </section>
    </div></section>
  </main>;
}
