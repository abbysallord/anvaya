"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ASSISTANT_OPEN } from "../../lib/anim";
import { ArrowUpRight, Chat, Grid, Home, Layers } from "./icons";

/** Phones only: an app-style dock replaces the top navigation, so every section is one thumb-reach tap away. */
export function MobileDock() {
  const path = usePathname();
  const item = (href: string, label: string, icon: React.ReactNode, current: boolean) =>
    <Link href={href} className="dock-item" aria-current={current ? "page" : undefined}>{icon}<span>{label}</span></Link>;
  return <nav className="dock" aria-label="Sections">
    {item("/", "Home", <Home />, path === "/")}
    {item("/work", "Work", <Layers />, path.startsWith("/work"))}
    <Link href="/project" className="dock-start" aria-current={path === "/project" ? "page" : undefined} aria-label="Start a project"><ArrowUpRight /><span>Start</span></Link>
    {item("/pricing", "Pricing", <Grid />, path === "/pricing")}
    <button type="button" className="dock-item" onClick={() => window.dispatchEvent(new Event(ASSISTANT_OPEN))}><Chat /><span>Ask</span></button>
  </nav>;
}
