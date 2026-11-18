"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { animate } from "animejs";
import { contact, westRoad } from "../../lib/site";
import { afterOpening, reducedMotion } from "../../lib/anim";
import type { Pano } from "./pano";
import { ArrowUpRight, Drag, WhatsApp } from "./icons";

const src = (room: string, phone: boolean) => `/work/westroad/pano-${room}-${phone ? "2k" : "4k"}.webp`;

/** Home stage: the product itself. A live 360° view of a delivered flat sits behind the headline; the reader can drag
    to look around and step between rooms. A still poster holds the frame first and remains for reduced motion or
    missing WebGL. On phones the view sits on top and the copy becomes a sheet beneath it. */
export function PanoHero() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const view = useRef<HTMLDivElement>(null);
  const pano = useRef<Pano | null>(null);
  const needle = useRef<SVGGElement>(null);
  const [room, setRoom] = useState(0);
  const [live, setLive] = useState(false);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (reducedMotion() || !canvas.current || !view.current) return;
    const el = canvas.current, frame = view.current;
    let cancelled = false, idle = 0, observer: IntersectionObserver | undefined;
    const visible = () => { pano.current?.setActive(!document.hidden && inView); };
    let inView = true;
    // WebGL setup waits for the opening and an idle moment so it never competes with first paint.
    const stop = afterOpening(() => {
      const begin = async () => {
        try {
          const { createPano } = await import("./pano");
          if (cancelled) return;
          const phone = matchMedia("(max-width: 760px)").matches;
          const instance = createPano(el, { fov: 68, drift: true, onInteract: () => setTouched(true), onHeading: yaw => needle.current?.setAttribute("transform", `rotate(${-yaw} 16 16)`) });
          pano.current = instance;
          await instance.show(src(westRoad.rooms[0].id, phone), westRoad.rooms[0].yaw);
          if (cancelled) { instance.destroy(); return; }
          setLive(true);
          animate(el, { opacity: [0, 1], duration: 900, ease: "outQuad" });
          observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; visible(); }, { threshold: .05 });
          observer.observe(frame);
          document.addEventListener("visibilitychange", visible);
          visible();
        } catch { /* No WebGL: the poster stays. */ }
      };
      idle = "requestIdleCallback" in window ? requestIdleCallback(() => { void begin(); }, { timeout: 1200 }) : -setTimeout(() => { void begin(); }, 400);
    });
    return () => {
      cancelled = true; stop(); observer?.disconnect(); document.removeEventListener("visibilitychange", visible);
      if (idle > 0) cancelIdleCallback(idle); else clearTimeout(-idle);
      pano.current?.destroy(); pano.current = null;
    };
  }, []);

  async function enter(index: number) {
    if (index === room || !pano.current || !canvas.current) return;
    setRoom(index); setTouched(true);
    const next = westRoad.rooms[index], el = canvas.current;
    await animate(el, { opacity: 0, scale: 1.04, duration: 260, ease: "inQuad" });
    try { await pano.current.show(src(next.id, matchMedia("(max-width: 760px)").matches), next.yaw); } catch { /* keep the previous room */ }
    animate(el, { opacity: 1, scale: [1.04, 1], duration: 700, ease: "outQuart" });
  }

  return <section className="stage" id="top" aria-labelledby="stage-title">
    <div className="stage-view" ref={view}>
      <picture className="stage-poster">
        <source media="(max-width: 760px)" srcSet="/work/westroad/hero-mobile.webp" />
        <img src="/work/westroad/hero-desktop.webp" width={2400} height={1500} alt="Rendered living room of the West Road residence: a sectional sofa and round table, with the dining area beyond" fetchPriority="high" decoding="async" />
      </picture>
      <canvas ref={canvas} className="stage-canvas" tabIndex={live ? 0 : -1} role="img" aria-label={`360° view of the ${westRoad.rooms[room].label.toLowerCase()} at the West Road residence. Drag, or use the left and right arrow keys, to look around.`} />
      <div className="stage-scrim" aria-hidden="true" />
      {live && <div className="stage-rooms" role="group" aria-label="Rooms">
        {westRoad.rooms.map((r, i) => <button key={r.id} type="button" className="stage-room" aria-pressed={i === room} onClick={() => { void enter(i); }}>{r.label}</button>)}
      </div>}
      {live && <p className={`stage-hint${touched ? " is-done" : ""}`} aria-hidden="true"><Drag />Drag to look around</p>}
      <div className="stage-meta">
        <svg className="stage-compass" viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="14.5" /><g ref={needle}><path d="M16 5.5 19 16h-6z" className="north" /><path d="M16 26.500 13 16h6z" /></g></svg>
        <p><b>{westRoad.name}</b><span>{westRoad.kind}</span></p>
        <a href={westRoad.tour} target="_blank" rel="noopener noreferrer" className="stage-open">Open the full tour<ArrowUpRight /></a>
      </div>
    </div>
    <div className="stage-copy">
      <p className="label stage-label" data-rise><b>●</b> Launch kits for real estate developers</p>
      <h1 id="stage-title" className="display" data-split>Sell the flat before it&rsquo;s <em>built.</em></h1>
      <p className="stage-lede" data-rise="120">A 360° walkthrough, a project website and WhatsApp follow-up, built as one kit, so buyers can walk in, ask and book a visit from their phone.</p>
      <div className="stage-actions" data-rise="200">
        <Link href="/#bundles" className="btn btn-light">See the launch kits<ArrowUpRight /></Link>
        {contact.whatsapp
          ? <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-glass"><WhatsApp />WhatsApp us</a>
          : <Link href="/project" className="btn btn-glass">Start a project</Link>}
      </div>
      <p className="stage-also" data-rise="260">Not a developer? <Link href="/#bundles-businesses">See bundles for clinics, schools and shops</Link></p>
    </div>
  </section>;
}
