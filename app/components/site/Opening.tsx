"use client";
import { useEffect, useRef } from "react";
import { createTimeline, stagger } from "animejs";
import { OPENING_DONE, OPENING_KEY } from "../../lib/anim";

/** The opening: the wordmark rises letter by letter over ink, a thread draws across, and the screen lifts. It plays
    once per session on Home, lasts about 1.7 seconds, can be skipped, and never plays under reduced motion or on deep
    links (the pre-paint script in the layout decides, so the page is never hidden without it). */
export function Opening() {
  const overlay = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = document.documentElement, el = overlay.current;
    if (root.dataset.opening !== "playing" || !el) return;
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      try { sessionStorage.setItem(OPENING_KEY, "1"); } catch { /* storage blocked: it simply plays again next time */ }
      root.dataset.opening = "done";
      window.dispatchEvent(new Event(OPENING_DONE));
    };
    const timeline = createTimeline({ defaults: { ease: "outExpo" }, onComplete: finish })
      .add(el.querySelectorAll(".opening-letter"), { y: ["110%", "0%"], duration: 800, delay: stagger(45) }, 80)
      .add(el.querySelectorAll(".opening-thread"), { scaleX: [0, 1], duration: 700, ease: "inOutQuart" }, 360)
      .add(el.querySelectorAll(".opening-indic"), { opacity: [0, 1], duration: 500 }, 520)
      .add(el, { y: "-100%", duration: 720, ease: "inOutQuart" }, 1050);
    const skip = () => { timeline.pause(); el.style.transform = "translateY(-100%)"; finish(); };
    const key = (event: KeyboardEvent) => { if (event.key === "Escape") skip(); };
    el.addEventListener("click", skip); window.addEventListener("keydown", key);
    const guard = setTimeout(skip, 3200);
    return () => { clearTimeout(guard); el.removeEventListener("click", skip); window.removeEventListener("keydown", key); timeline.pause(); };
  }, []);
  return <div className="opening" ref={overlay} aria-hidden="true">
    <p className="opening-word">{"ANVAYA".split("").map((letter, i) => <span key={i} className="opening-clip"><span className="opening-letter">{letter}</span></span>)}</p>
    <span className="opening-thread" />
    <span className="opening-indic indic" lang="hi">अन्वय</span>
    <span className="opening-skip">Tap to skip</span>
  </div>;
}
