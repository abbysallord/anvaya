import type { Metadata } from "next";
import Link from "next/link";
import { addOns, bundles, foundingOffer, plans, reviewRounds } from "../lib/site";

const expressAddOn = (addOns.find(([k]) => k.startsWith("Express"))?.[1] ?? "+25%").replace("+", "");

export const metadata: Metadata = {
  title: "Project terms",
  description:
    "Anvaya’s published scope, payment, ownership, and technical warranty terms.",
};
export default function TermsPage() {
  return (
    <main id="main-content" tabIndex={-1} className="wrap inner-page policy-page">
      <div className="page-heading">
        <h1>
          Project terms<span className="accent">.</span>
        </h1>
        <p>The practical foundations of an Anvaya engagement.</p>
      </div>
      <div className="policy-content">
        <section>
          <h2>Scope and timelines</h2>
          <p>
            You send the floorplan (a PDF, CAD file or clear phone photo) and
            the finishes you plan to use. We confirm the rooms, views and
            delivery date in writing before work starts. Each bundle and service
            below states its delivery time. Express delivery in about half the
            time costs {expressAddOn} more.
          </p>
          <p>
            {reviewRounds.note} They cover furniture, finishes, lighting and
            camera angles. Moving walls or resizing rooms after you approve the
            layout is quoted as a new floorplan.
          </p>
        </section>
        <section>
          <h2>Pricing and payment</h2>
          <p>
            Prices are in US dollars. The INR figures on our pricing pages are
            conversions at a dated reference rate, shown for convenience; your
            written quote fixes the amount and currency.
          </p>
          <p>Bundles are fixed prices for a finished result:</p>
          <ul>
            {bundles.map(b => <li key={b.id}><b>{b.name}</b>: {b.price}{"monthly" in b && b.monthly ? ` ${b.monthly}` : ""} · {b.unit} · {b.timeline}</li>)}
          </ul>
          <p>Individual 3D services, priced per unit type (one floorplan, such as a 2BHK):</p>
          <ul>
            {plans.map(pl => <li key={pl.id}><b>{pl.name}</b>: {pl.prices.map(([k, v]) => `${k} ${v}`).join(", ")} · {pl.timeline}</li>)}
          </ul>
          <p>Add-ons:</p>
          <ul>
            {addOns.map(([k, v]) => <li key={k}>{k}: {v}</li>)}
          </ul>
          <p>
            {foundingOffer.detail} Websites, enquiry follow-up and video ads
            outside a bundle are quoted per project. Every client pays from the
            same published <Link href="/pricing">price list</Link>.
          </p>
          <p>
            We take a 50% advance to start and the balance before final files,
            by international bank transfer (UPI or bank transfer in India).
            Previews carry a watermark until payment
            is complete. Third-party charges, such as WhatsApp message fees,
            are listed and agreed up front. No GST is added at present.
          </p>
        </section>
        <section>
          <h2>Confidentiality</h2>
          <p>
            Your floorplans and renders are never shown to anyone, including
            other builders, without your written permission. We sign an NDA
            on request at no extra cost.
          </p>
        </section>
        <section>
          <h2>Ownership and handover</h2>
          <p>
            Once the final payment is made, you own the delivered images,
            videos and tour, and may use them in any marketing. Anvaya keeps
            its own tools, scripts and furniture library, which are not part of
            the handover.
          </p>
        </section>
        <section>
          <h2>Renders in advertising</h2>
          <p>
            Renders show the approved plan as an artist’s impression; finishes
            and furniture are indicative. Under RERA, brochures and ads must
            carry your project’s RERA registration number, and renders should
            be labelled as artist’s impressions. Keeping ads accurate to the
            registered project is the promoter’s responsibility.
          </p>
        </section>
        <section>
          <h2>Defect warranty</h2>
          <p>
            For 14 days after delivery, report any broken link, rendering error
            or room that does not match the approved plan, and we fix it at no
            cost. Tour hosting is included for 12 months, then {addOns.find(([k]) => k.startsWith("Tour hosting"))?.[1]}.
          </p>
        </section>
        <section>
          <h2>International clients</h2>
          <p>
            We work remotely with clients worldwide, in English. Projects are
            priced in US dollars and can be quoted in EUR, GBP, AED or INR for
            the same scope, paid by international bank transfer. Any taxes or duties that apply
            in your country are your responsibility unless your quote says
            otherwise.
          </p>
        </section>
        <section>
          <h2>Third-party content and licences</h2>
          <p>
            Some furniture, decor, materials and fonts in our renders come from
            licensed libraries: Creative Commons (CC BY 4.0 and CC0),
            royalty-free marketplace licences and public-domain artwork. We use
            each under its licence and keep the required credits on our{" "}
            <Link href="/credits">licences and credits</Link> page. Your rights
            to the delivered images, videos and tour are not affected. We do not
            hand over third-party 3D model files, because their licences do not
            allow it.
          </p>
        </section>
        <section>
          <h2>Studio samples and portfolio</h2>
          <p>
            The sample homes on this site are Anvaya&rsquo;s own designs, made
            from floor plans to show our work. They are labelled as studio
            samples. Client projects appear only with the client&rsquo;s written
            permission, and only as delivered.
          </p>
        </section>
        <section>
          <h2>Your engagement agreement</h2>
          <p>
            This page summarizes the studio’s published offer. Exact
            deliverables, support arrangements, dates, and any
            engagement-specific terms are recorded in the agreed project scope.
          </p>
        </section>
        <Link className="text-link" href="/project">
          Create a project brief ↗
        </Link>
      </div>
    </main>
  );
}
