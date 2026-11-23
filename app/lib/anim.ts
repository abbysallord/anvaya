"use client";
/* Shared motion helpers for the anime.js layer (15 November 2026). The older GSAP helpers in lib/motion.ts remain only
   for components that are no longer mounted. */

export const OPENING_KEY = "anvaya-intention-intro"; // same key as the earlier intro, so tests and previews can switch it off
export const OPENING_DONE = "anvaya:opening-done";
export const ASSISTANT_OPEN = "anvaya:assistant";
export const EASE_OUT = "outExpo";
export const EASE_IN_OUT = "inOutQuart";

export const reducedMotion = () => typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
export const finePointer = () => typeof window !== "undefined" && matchMedia("(pointer: fine)").matches;
export const isPhone = () => typeof window !== "undefined" && matchMedia("(max-width: 760px)").matches;

/** Runs the callback once the opening has released the page, or straight away when it is not playing. */
export function afterOpening(callback: () => void) {
  if (typeof document === "undefined" || document.documentElement.dataset.opening !== "playing") { callback(); return () => {}; }
  let done = false;
  const run = () => { if (done) return; done = true; clearTimeout(timer); window.removeEventListener(OPENING_DONE, run); callback(); };
  const timer = setTimeout(run, 4000);
  window.addEventListener(OPENING_DONE, run);
  return () => { done = true; clearTimeout(timer); window.removeEventListener(OPENING_DONE, run); };
}
