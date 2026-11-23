import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Footer } from "./components/cinema/Shared";
import { SiteHeader } from "./components/site/SiteHeader";
import { MobileDock } from "./components/site/MobileDock";
import { Assistant } from "./components/site/Assistant";
import { Opening } from "./components/site/Opening";
import { Motion } from "./components/site/Motion";
import { ButterflyLayer } from "./components/cinema/ButterflyLayer";
import { audiences, bundles, contact, siteUrl } from "./lib/site";
import "lenis/dist/lenis.css";
import "./cinema.css";
import "./light.css";
import "./system.css";
import "./home.css";
import "./app.css";

const serif = localFont({ src: [{ path: "./fonts/Fraunces-normal-Latin.woff2", style: "normal" }, { path: "./fonts/Fraunces-italic-Latin.woff2", style: "italic" }], variable: "--font-serif", weight: "100 900", display: "swap" });
const sans = localFont({ src: "./fonts/Inter-Latin.woff2", variable: "--font-sans", weight: "100 900", display: "swap" });
const mono = localFont({ src: "./fonts/geist-mono-latin.woff2", variable: "--font-mono", weight: "100 900", display: "swap" });
// Hind only sets the wordmark अन्वय, so it ships subset to those glyphs (4 KB, from Hind-Regular via pyftsubset).
const showcase = localFont({ src: [{ path: "./fonts/InstrumentSerif-normal-Latin.woff2", style: "normal" }, { path: "./fonts/InstrumentSerif-italic-Latin.woff2", style: "italic" }], variable: "--font-showcase", weight: "400", display: "swap" });
const hind = localFont({ src: "./fonts/Hind-Anvaya.woff2", variable: "--font-hind", weight: "400", display: "swap" });
const description = "Anvaya builds end-to-end launch kits for real estate developers (360° walkthroughs, project websites and WhatsApp follow-up) and website-plus-booking bundles for growing businesses.";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Anvaya — Launch kits for real estate developers and growing businesses", template: "%s — Anvaya" },
  description,
  applicationName: "Anvaya",
  icons: { icon: "/icon.svg" },
  openGraph: { type: "website", siteName: "Anvaya", title: "Anvaya — Sell the flat before it is built", description, locale: "en_IN", url: "/" },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true, googleBot: { "max-image-preview": "large", "max-snippet": -1 } },
};
export const viewport: Viewport = { themeColor: "#ffffff", colorScheme: "light" };
// Structured data: who Anvaya is and what it sells, for search engines and AI answers. Only published facts.
const profiles = contact.socials.map(([, href]) => href);
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService", "@id": `${siteUrl}/#organization`, name: "Anvaya", alternateName: "Anvaya Digital Studio", url: siteUrl,
      logo: `${siteUrl}/brand/anvaya-logo.png`, image: `${siteUrl}/work/westroad/hero-desktop.webp`, description,
      address: { "@type": "PostalAddress", addressCountry: "IN" }, areaServed: ["IN", "Worldwide"], priceRange: "$$",
      knowsAbout: ["3D architectural visualisation", "360° virtual tours", "Real estate marketing", "Web design", "WhatsApp automation"],
      ...(contact.email && { email: contact.email }), ...(profiles.length && { sameAs: profiles }),
      hasOfferCatalog: {
        "@type": "OfferCatalog", name: "Anvaya bundles",
        itemListElement: bundles.map(b => ({
          "@type": "Offer", name: b.name, description: `${b.promise} ${b.includes.join("; ")}.`, url: `${siteUrl}/pricing#${b.audience}`,
          priceCurrency: "USD", price: b.price.replace(/[^0-9]/g, ""), category: audiences[b.audience].title,
          itemOffered: { "@type": "Service", name: b.name, provider: { "@id": `${siteUrl}/#organization` } },
        })),
      },
    },
    { "@type": "WebSite", "@id": `${siteUrl}/#website`, url: siteUrl, name: "Anvaya", inLanguage: "en-IN", publisher: { "@id": `${siteUrl}/#organization` } },
  ],
};
// Runs before first paint. It decides whether the Home opening will play (once per session, never for reduced motion
// or deep links) and switches on the entry states for scroll reveals, so nothing flashes before the motion layer
// loads. If that layer never reports ready, the entry states are removed and all content shows.
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const PREPAINT = `try{var d=document.documentElement,p=location.pathname,b=${JSON.stringify(BASE_PATH)};if(b&&p.indexOf(b)===0)p=p.slice(b.length);if(!matchMedia("(prefers-reduced-motion: reduce)").matches){d.classList.add("anim");setTimeout(function(){if(!window.__anvayaMotion)d.classList.remove("anim")},5000);if(p.replace(/\\/+$/,"")===""&&!location.hash&&sessionStorage.getItem("anvaya-intention-intro")!=="1")d.dataset.opening="playing"}}catch(e){}`;
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${serif.variable} ${sans.variable} ${mono.variable} ${hind.variable} ${showcase.variable}`} suppressHydrationWarning>
    <head>
      <script dangerouslySetInnerHTML={{ __html: PREPAINT }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </head>
    <body>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <SiteHeader />
      <ButterflyLayer />
      {children}
      <Footer />
      <MobileDock />
      <Assistant />
      <Opening />
      <Motion />
    </body>
  </html>;
}
