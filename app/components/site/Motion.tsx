"use client";
import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Lenis from "lenis";
import { animate, createScope, type Scope } from "animejs";
import { afterOpening, finePointer, reducedMotion } from "../../lib/anim";
import { build } from "./reveals";
import { Wordmark } from "../cinema/Logo";

declare global { interface Window { __anvayaMotion?: boolean } }

/** Site-wide motion, on anime.js: smooth wheel scrolling, header state, scroll reveals, scroll-linked sequences,
    magnetic buttons and route changes. Nothing here runs under reduced motion, and no content depends on it. */
export function Motion() {
  const path = usePathname();
  const router = useRouter();
  const veil = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const leaving = useRef(false);
  const lenisRef = useRef<Lenis | null>(null);

  // Global: runs once.
  useEffect(() => {
    const root = document.documentElement;
    if (reducedMotion()) { root.classList.remove("anim"); return; }
    window.__anvayaMotion = true;
    root.classList.add("anim");

    // Smooth wheel scrolling for mouse users only; touch keeps native momentum.
    let frame = 0;
    if (finePointer()) {
      const lenis = new Lenis({ lerp: .1, anchors: true });
      lenisRef.current = lenis;
      const tick = (time: number) => { lenis.raf(time); frame = requestAnimationFrame(tick); };
      frame = requestAnimationFrame(tick);
    }

    const header = document.querySelector<HTMLElement>(".bar");
    let last = scrollY, queued = false;
    const update = () => {
      queued = false;
      const y = scrollY, stage = document.querySelector<HTMLElement>(".stage, .about-hero, .hero");
      header?.classList.toggle("over-stage", Boolean(stage?.matches(".stage, .about-hero"))); // dark stages only
      header?.classList.toggle("is-solid", y > (stage ? stage.offsetHeight - 96 : 8));
      header?.classList.toggle("is-hidden", y > last && y > 480);
      last = y;
      const max = document.documentElement.scrollHeight - innerHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
    };
    const onScrollEvent = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
    window.addEventListener("scroll", onScrollEvent, { passive: true });
    update();

    // Route changes: the page lifts away under a paper veil, then the next one settles in.
    const click = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element | null)?.closest?.<HTMLAnchorElement>("a[href]");
      if (!anchor || (anchor.target && anchor.target !== "_self") || anchor.hasAttribute("download") || root.dataset.opening === "playing") return;
      const url = new URL(anchor.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname || leaving.current || !veil.current) return;
      event.preventDefault();
      leaving.current = true;
      const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
      const href = (base && url.pathname.startsWith(base) ? url.pathname.slice(base.length) || "/" : url.pathname) + url.search + url.hash;
      router.prefetch(href);
      veil.current.style.visibility = "visible";
      animate(veil.current, { opacity: [0, 1], duration: 260, ease: "inOutQuad" });
      animate("main", { opacity: [1, 0], y: [0, -12], duration: 260, ease: "inQuad" });
      // A plain timer, never an animation callback: a slow frame must not hold a click hostage.
      setTimeout(() => router.push(href), 280);
      setTimeout(() => { if (leaving.current) arrive(); }, 4500);
    };
    const arrive = () => {
      leaving.current = false;
      const el = veil.current;
      if (!el) return;
      animate(el, { opacity: 0, duration: 420, delay: 60, ease: "outQuad", onComplete: () => { el.style.visibility = "hidden"; } });
    };
    arriveRef.current = arrive;
    window.addEventListener("click", click, true);

    // Buttons lean toward a mouse pointer and spring back.
    let magnet: HTMLElement | null = null;
    const release = () => { if (magnet) animate(magnet, { x: 0, y: 0, duration: 700, ease: "outElastic(1, .5)" }); magnet = null; };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const next = (event.target as Element).closest?.<HTMLElement>(".btn, .action:not(.action-text)") ?? null;
      if (next !== magnet) release();
      magnet = next;
      if (!magnet) return;
      const box = magnet.getBoundingClientRect();
      animate(magnet, { x: (event.clientX - box.left - box.width / 2) * .2, y: (event.clientY - box.top - box.height / 2) * .3, duration: 420, ease: "outQuart" });
    };
    if (finePointer()) window.addEventListener("pointermove", move, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      lenisRef.current?.destroy(); lenisRef.current = null;
      window.removeEventListener("scroll", onScrollEvent);
      window.removeEventListener("click", click, true);
      window.removeEventListener("pointermove", move);
      release();
      root.classList.remove("anim");
      window.__anvayaMotion = false;
    };
  }, [router]);

  const arriveRef = useRef<() => void>(() => {});

  // Per page: build the reveals once the opening has released the page and the fonts are in.
  useEffect(() => {
    if (reducedMotion()) return;
    const arrived = leaving.current;
    if (arrived) arriveRef.current();
    lenisRef.current?.resize();
    let scope: Scope | undefined, cleanup = () => {}, cancelled = false;
    const stop = afterOpening(() => {
      document.fonts.ready.then(() => {
        if (cancelled) return;
        const main = document.querySelector<HTMLElement>("main");
        if (!main) return;
        if (arrived) animate(main, { opacity: [0, 1], y: [16, 0], duration: 620, ease: "outQuart", onComplete: () => { main.style.transform = ""; main.style.opacity = ""; } });
        scope = createScope({ root: document.body }).add(() => { cleanup = build(main, arrived ? 260 : 0); });
      });
    });
    return () => { cancelled = true; stop(); cleanup(); scope?.revert(); };
  }, [path]);

  return <>
    <div className="scroll-progress" ref={bar} aria-hidden="true" />
    <div className="route-veil" ref={veil} aria-hidden="true"><Wordmark /></div>
  </>;
}
