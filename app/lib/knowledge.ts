import { addOns, audiences, bundles, foundingOffer, plans, quoted, terms, westRoad } from "./site";

/** Everything the website assistant is allowed to state, generated from the same data the pages render, so the
    assistant and the site can never disagree. Deterministic output: it is also the cached prompt prefix. */
export function knowledge() {
  const bundleLines = bundles.map(b => `- ${b.name} (${audiences[b.audience].label.toLowerCase()}): ${b.price}${b.monthly ? ` ${b.monthly}` : ""}. ${b.unit}. Delivery: ${b.timeline}. ${b.promise} Includes: ${b.includes.join("; ")}.`);
  const journeys = (Object.keys(audiences) as (keyof typeof audiences)[]).map(key => `${audiences[key].title} (${audiences[key].label.toLowerCase()}): ${audiences[key].lede} Journey: ${audiences[key].journey.map(([step, detail]) => `${step}: ${detail}`).join(" ")}`);
  return [
    "# Anvaya facts",
    "Anvaya is a technology and design studio based in India, working with clients in India and abroad. It sells end-to-end bundles rather than separate services.",
    "## Bundles", ...bundleLines,
    "## How the bundles work", ...journeys,
    "## Individual 3D items (per unit type, meaning one floorplan such as a 2BHK)",
    ...plans.map(p => `- ${p.name}: ${p.prices.map(([label, price]) => `${label} ${price}`).join(", ")} (${p.unit}). Delivery: ${p.timeline}. ${p.rounds}. Includes: ${p.includes.join("; ")}.`),
    "## Add-ons", ...addOns.map(([item, price]) => `- ${item}: ${price}`),
    "## Quoted per project (starting prices)", ...quoted.map(q => `- ${q.name}: ${q.price}. ${q.detail}`),
    "## Terms", ...terms.map(([term, detail]) => `- ${term}: ${detail}`),
    `## Founding clients\n${foundingOffer.detail}`,
    `## Published work\n${westRoad.name}: ${westRoad.kind}. ${westRoad.facts.map(([value, label]) => `${value} ${label}`).join(", ")}. Live tour: ${westRoad.tour}`,
    "## Availability\nWebsites and branding, AI and WhatsApp automation, and 3D renders and walkthroughs are open for new projects. Mobile and web apps are not offered yet.",
    "## Starting a project\nThe project form is at /project (three short steps, about two minutes). Payment is 50% advance and 50% before final files, by international bank transfer (UPI or bank transfer in India). Prices are in US dollars.",
  ].join("\n");
}

export const assistantRules = `You are the assistant on the website of Anvaya, a technology and design studio. You answer visitors' questions about Anvaya's bundles, prices, timelines, terms and how to start.

Answer only from the facts below. They are the complete, current list: if a price, date, discount, feature or commitment is not in them, say you do not have that detail and point the visitor to the project form at /project (or WhatsApp, if they ask how to reach a person). Never estimate a price, offer a discount, promise a delivery date for a specific project, or describe work Anvaya has not published.

Keep answers short and plain: two to four sentences, or a short list when comparing bundles. Quote prices in Indian rupees exactly as written. Reply in the visitor's language when they write in Telugu or Hindi. When a visitor describes their situation, recommend the one bundle that fits and say why in a sentence. A person at Anvaya confirms every scope and quote in writing, so present your answers as guidance, not a contract. If asked about anything unrelated to Anvaya or its services, say briefly that you can only help with Anvaya's work.`;
