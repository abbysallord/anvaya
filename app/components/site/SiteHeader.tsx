"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoMark, Wordmark } from "../cinema/Logo";
import { ArrowUpRight } from "./icons";

const links = [
  { href: "/work", label: "Work", current: (p: string) => p.startsWith("/work") },
  { href: "/gallery", label: "Gallery", current: (p: string) => p === "/gallery" },
  { href: "/pricing", label: "Pricing", current: (p: string) => p === "/pricing" },
  { href: "/services", label: "Capabilities", current: (p: string) => p.startsWith("/services") },
  { href: "/studio", label: "Studio", current: (p: string) => p === "/studio" },
  { href: "/blog", label: "News", current: (p: string) => p.startsWith("/blog") },
];

// Pages that open on a dark stage, where the bar reads light until the reader scrolls past it.
/** Top bar. Desktop: brand, a centred nav pill and the project action. Phones: brand and the action only; the
    sections move to the bottom dock. */
export function SiteHeader() {
  const path = usePathname();
  return <header className={`bar${path === "/studio" ? " over-stage" : ""}`}>
    <div className="shell bar-inner">
      <Link className="bar-brand" href="/" aria-label="Anvaya home"><LogoMark /><Wordmark /></Link>
      <nav className="bar-nav" aria-label="Main navigation">
        {links.map(l => <Link key={l.href} className="bar-link" href={l.href} aria-current={l.current(path) ? "page" : undefined}>{l.label}</Link>)}
      </nav>
      <Link href="/project" className="btn btn-primary bar-cta" aria-current={path === "/project" ? "page" : undefined}>Start a project<ArrowUpRight /></Link>
    </div>
  </header>;
}
