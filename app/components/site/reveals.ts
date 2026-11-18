import { animate, onScroll, splitText, stagger } from "animejs";
import { EASE_IN_OUT, EASE_OUT } from "../../lib/anim";

// Inner-page blocks written before the data attributes existed still rise on entry.
const LEGACY_RISE = [
  ".section-copy > *", ".principles article", ".belief-grid article", ".working-model > div",
  ".detail-capabilities article", ".step-list li", ".practice-card", ".engagement-card", ".plan-card",
  ".terms-grid > div", ".faq-item", ".cta-foot > p", ".cta-foot > div", ".form-aside > *", ".policy-content section",
  ".page-hero .action", ".work-feature-copy > *", ".range-list > *", ".footer-grid > *",
].join(",");
// Running text that reveals line by line.
const LINES = ".lede, [data-lines], .section-heading > p, .capabilities-heading p, .page-intro > p";
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/+=";

/** Builds one page's reveals with anime.js. Returns a cleanup for the observers and text splits it created.
    Entrances play once, as each element enters the viewport; scroll-linked sequences follow the scroll position. */
export function build(main: HTMLElement, delay: number) {
  const undo: (() => void)[] = [];
  const all = <T extends Element = HTMLElement>(selector: string) => Array.from(document.body.querySelectorAll<T>(selector)).filter(el => (main.contains(el) || el.closest(".site-footer")) && !el.closest(".hero"));

  // One observer plays each element's entrance once. Elements entering together are staggered.
  const plays = new Map<Element, (order: number) => void>();
  const observer = new IntersectionObserver(entries => {
    let order = 0;
    for (const entry of entries) {
      if (!entry.isIntersecting && entry.boundingClientRect.top > 0) continue; // still below the fold
      const play = plays.get(entry.target);
      if (!play) continue;
      plays.delete(entry.target); observer.unobserve(entry.target);
      play(entry.isIntersecting ? order++ : -1); // -1: skipped past by a jump, so settle at once
    }
  }, { rootMargin: "0px 0px -8% 0px", threshold: .01 });
  undo.push(() => observer.disconnect());
  const onEnter = (el: Element, play: (order: number) => void) => { plays.set(el, play); observer.observe(el); };
  const wait = (order: number, each = 70) => delay + Math.max(0, order) * each;

  // Headings: each word swings up out of its line, left to right.
  for (const el of all("[data-split], h1:not([data-nosplit]), h2:not([data-nosplit])")) {
    // Line splitting drops the space between lines from the text, so the original sentence becomes the label.
    const text = el.textContent?.replace(/\s+/g, " ").trim() || "";
    const hadLabel = el.hasAttribute("aria-label");
    if (!hadLabel && text) el.setAttribute("aria-label", text);
    const split = splitText(el, { lines: { wrap: "clip" }, words: true, accessible: false });
    split.lines.forEach((line, i) => { if (i < split.lines.length - 1) line.append(" "); });
    undo.push(() => { split.revert(); if (!hadLabel) el.removeAttribute("aria-label"); });
    el.style.visibility = "visible";
    const words = split.words as HTMLElement[];
    words.forEach(word => { word.style.transformOrigin = "0% 100%"; word.style.transform = "translateY(118%) rotate(7deg)"; });
    onEnter(el, order => animate(words, { y: ["118%", "0%"], rotate: [7, 0], duration: order < 0 ? 1 : 1150, delay: stagger(Math.min(55, 420 / words.length + 18), { start: wait(order, 60) }), ease: EASE_OUT }));
  }

  // Running text: lines rise in one after another (transform and opacity only, so it stays on the compositor).
  for (const el of all(LINES)) {
    const owner = el.closest("[data-rise], [data-stagger]");
    if (owner && owner !== el) { el.style.opacity = "1"; continue; } // revealed with its group instead
    const split = splitText(el, { lines: true, accessible: false });
    undo.push(() => split.revert());
    const lines = split.lines as HTMLElement[];
    lines.forEach(line => { line.style.opacity = "0"; });
    el.style.opacity = "1";
    onEnter(el, order => animate(lines, { opacity: [0, 1], y: [order < 0 ? 0 : 18, 0], duration: order < 0 ? 1 : 850, delay: stagger(80, { start: wait(order) + 120 }), ease: EASE_OUT }));
  }

  // Mono labels decode from scrambled glyphs.
  for (const el of all(".label")) {
    if (el.closest(".bundle")) continue;
    const nodes: Text[] = [], walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) nodes.push(walker.currentNode as Text);
    const finals = nodes.map(node => node.nodeValue || "");
    el.style.opacity = "0";
    const state = { progress: 0 };
    const draw = () => nodes.forEach((node, i) => {
      const final = finals[i], shown = Math.floor(state.progress * final.length);
      node.nodeValue = final.slice(0, shown) + Array.from(final.slice(shown), char => /\s/.test(char) ? char : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]).join("");
    });
    const settle = () => nodes.forEach((node, i) => { node.nodeValue = finals[i]; });
    undo.push(settle);
    onEnter(el, order => {
      animate(el, { opacity: [0, 1], duration: order < 0 ? 1 : 300, delay: wait(order) });
      if (order < 0) return;
      animate(state, { progress: [0, 1], duration: 900, delay: wait(order), ease: "outQuad", onUpdate: draw, onComplete: settle });
    });
  }

  // Single elements and legacy blocks rise.
  for (const el of all(`[data-rise], ${LEGACY_RISE}`)) {
    if (el.matches(LINES) || el.matches(".label") || (el.closest("[data-stagger]") && !el.hasAttribute("data-rise"))) continue;
    el.style.opacity = "0";
    const extra = Number(el.dataset.rise) || 0;
    onEnter(el, order => animate(el, { opacity: [0, 1], y: [order < 0 ? 0 : 30, 0], duration: order < 0 ? 1 : 1000, delay: wait(order) + extra, ease: EASE_OUT }));
  }
  // Groups: children rise one after another.
  for (const el of all("[data-stagger]")) {
    const items = Array.from(el.children) as HTMLElement[];
    items.forEach(item => { item.style.opacity = "0"; });
    const each = Number(el.dataset.stagger) || 70;
    onEnter(el, order => animate(items, { opacity: [0, 1], y: [order < 0 ? 0 : 36, 0], duration: order < 0 ? 1 : 1000, delay: stagger(each, { start: delay }), ease: EASE_OUT }));
  }
  // Images wipe open from the top; the picture inside settles unless something else drives it.
  for (const el of all("[data-clip]")) {
    const inner = el.dataset.clip === "plain" ? null : el.querySelector("img");
    // Watch the parent: a fully clipped element has no visible area for the observer to report.
    onEnter(el.parentElement ?? el, order => {
      animate(el, { clipPath: ["inset(0% 0% 100% 0%)", "inset(0% 0% 0% 0%)"], duration: order < 0 ? 1 : 1350, delay: wait(order, 110), ease: EASE_IN_OUT });
      if (inner && order >= 0) animate(inner, { scale: [1.16, 1], duration: 1800, delay: wait(order, 110), ease: EASE_OUT });
    });
  }
  // Numbers count up to their value.
  for (const el of all("[data-count]")) {
    const target = Number(el.dataset.count) || 0, state = { value: 0 };
    onEnter(el, order => animate(state, { value: target, duration: order < 0 ? 1 : 1500, delay, ease: "outQuart", onUpdate: () => { el.textContent = String(Math.round(state.value)); } }));
  }
  // Bundle cards tip up into place, then each price wipes in and its list ticks down.
  for (const grid of all(".bundle-grid")) {
    const cards = Array.from(grid.children) as HTMLElement[];
    cards.forEach(card => { card.style.opacity = "0"; });
    onEnter(grid, order => {
      const quick = order < 0;
      animate(cards, { opacity: [0, 1], y: [quick ? 0 : 70, 0], rotateX: [quick ? 0 : 9, 0], duration: quick ? 1 : 1200, delay: stagger(120, { start: delay }), ease: EASE_OUT, onComplete: () => cards.forEach(card => { card.style.transform = ""; }) });
      if (quick) return;
      animate(grid.querySelectorAll(".bundle-price b"), { clipPath: ["inset(0% 100% 0% 0%)", "inset(0% 0% 0% 0%)"], duration: 900, delay: stagger(120, { start: delay + 380 }), ease: EASE_IN_OUT });
      animate(grid.querySelectorAll(".bundle-list li"), { opacity: [0, 1], x: [-14, 0], duration: 650, delay: stagger(28, { start: delay + 520 }), ease: EASE_OUT });
    });
  }
  // The footer name rises letter by letter out of the panel's edge.
  const word = document.querySelector<HTMLElement>(".site-footer .footer-word");
  if (word) {
    const split = splitText(word, { chars: { class: "split-char" }, accessible: false });
    undo.push(() => split.revert());
    const chars = split.chars as HTMLElement[];
    chars.forEach(char => { char.style.transform = "translateY(112%)"; });
    onEnter(word.parentElement ?? word, order => animate(chars, { y: ["112%", "0%"], duration: order < 0 ? 1 : 1400, delay: stagger(60), ease: EASE_OUT }));
  }

  // ---- Scroll-linked ----
  // Statement words fill in and settle as the paragraph crosses the viewport.
  for (const el of all("[data-fill]")) {
    const split = splitText(el, { words: true, accessible: false });
    undo.push(() => split.revert());
    animate(split.words, { opacity: [.14, 1], y: [".18em", "0em"], delay: stagger(60), duration: 400, ease: "linear", autoplay: onScroll({ target: el, enter: "bottom top", leave: "center bottom", sync: true }) });
  }
  // Drift.
  for (const el of all("[data-parallax]")) {
    const amount = Number(el.dataset.parallax) || 10;
    animate(el, { y: [`${amount}%`, `${-amount}%`], ease: "linear", autoplay: onScroll({ target: el.parentElement ?? el, enter: "bottom top", leave: "top bottom", sync: true }) });
  }
  hero(main, delay, undo);

  return () => undo.forEach(fn => fn());
}

/** Home hero (the glass fan): the headline builds letter by letter, the highlight sweeps behind "Built to last.", then
    the copy settles in. Leaving the hero, the copy drifts up and fades while a horizon of light rises. */
function hero(main: HTMLElement, delay: number, undo: (() => void)[]) {
  const el = main.querySelector<HTMLElement>(".hero");
  if (!el) return;
  const first = el.querySelector<HTMLElement>(".hero-line:not(.hero-mark) > span");
  if (first) {
    const split = splitText(first, { words: true, chars: true, accessible: false });
    undo.push(() => split.revert());
    (split.chars as HTMLElement[]).forEach(char => { char.style.opacity = "0"; });
    animate(split.chars, { y: ["70%", "0%"], rotateX: [-70, 0], opacity: [0, 1], duration: 1400, delay: stagger(35, { start: delay + 150 }), ease: EASE_OUT });
  }
  const hide = (selector: string) => { const els = Array.from(el.querySelectorAll<HTMLElement>(selector)); els.forEach(node => { node.style.opacity = "0"; }); return els; };
  const mark = hide(".hero-mark > span"), copy = hide(".hero-lede-top, .hero-actions > *"), foot = hide(".hero-foot > *, .hero-scroll");
  if (mark.length) animate(mark, { opacity: [0, 1], scale: [1.12, 1], filter: ["blur(8px)", "blur(0px)"], duration: 1600, delay: delay + 550, ease: EASE_OUT, onComplete: () => mark.forEach(node => { node.style.filter = ""; }) });
  const box = el.querySelector<HTMLElement>(".hero-mark-box");
  if (box) animate(box, { scaleX: [0, 1], duration: 1200, delay: delay + 750, ease: EASE_IN_OUT });
  if (copy.length) animate(copy, { opacity: [0, 1], y: [24, 0], duration: 1100, delay: stagger(80, { start: delay + 900 }), ease: EASE_OUT });
  if (foot.length) animate(foot, { opacity: [0, 1], y: [14, 0], duration: 1000, delay: stagger(80, { start: delay + 1200 }), ease: EASE_OUT });
  const leave = () => onScroll({ target: el, enter: "top top", leave: "top bottom", sync: true });
  const center = el.querySelector(".hero-center"), horizon = el.querySelector(".hero-horizon"), footBar = el.querySelector(".hero-foot");
  if (center) animate(center, { y: ["0%", "-22%"], scale: [1, .94], opacity: [1, 0], ease: "linear", autoplay: leave() });
  if (horizon) animate(horizon, { y: ["55%", "-5%"], scaleX: [.7, 1.15], opacity: [0, 1], ease: "linear", autoplay: leave() });
  if (footBar) animate(footBar, { y: [0, -40], opacity: [1, 0], ease: "linear", autoplay: leave() });
}
