"use client";
import { useRef, type MouseEvent, type ReactNode } from "react";
import { animate, type JSAnimation } from "animejs";

/* FAQ rows stay native <details>, so they open without JavaScript and keep their semantics. With JavaScript the
   summary click is intercepted: anime.js eases the answer's height open or closed with a light fade and lift, and the icon
   turns at the click (data-open) rather than when the animation ends. Reduced motion toggles instantly. */

const OPEN = { duration: 420, ease: "outQuart" } as const;
const CLOSE = { duration: 300, ease: "inOutQuad" } as const;

function FaqItem({ number, question, answer }: { number: string; question: string; answer: ReactNode }) {
  const item = useRef<HTMLDetailsElement>(null), body = useRef<HTMLDivElement>(null), running = useRef<JSAnimation[]>([]);

  function toggle(event: MouseEvent) {
    const details = item.current, panel = body.current;
    if (!details || !panel || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    event.preventDefault();
    // A closed <details> can still report its content's height, so a closed row always starts from zero.
    const from = details.open ? panel.getBoundingClientRect().height : 0;
    running.current.forEach(animation => animation.pause());
    const opening = !(details.open && details.dataset.open !== "false");
    details.dataset.open = String(opening);
    if (opening) details.open = true;
    const to = opening ? panel.scrollHeight : 0;
    const content = panel.firstElementChild as HTMLElement | null;
    const timing = opening ? OPEN : CLOSE;
    const height = animate(panel, { height: [`${from}px`, `${to}px`], ...timing, onComplete: () => {
      if (!opening) details.open = false;
      panel.style.height = ""; // back to auto, so the answer reflows with the page
      running.current = [];
    } });
    const fade = content ? animate(content, opening ? { opacity: [0, 1], y: [-6, 0], ...timing } : { opacity: [1, 0], ...timing }) : undefined;
    running.current = fade ? [height, fade] : [height];
  }

  return <details className="faq-item" ref={item}>
    <summary onClick={toggle}><span className="faq-number">{number}</span><span className="faq-question">{question}</span><span className="faq-icon" aria-hidden="true" /></summary>
    <div className="faq-body" ref={body}><div className="faq-answer">{answer}</div></div>
  </details>;
}

export function Faq({ items }: { items: readonly (readonly [string, ReactNode])[] }) {
  return <div className="faq-list">{items.map(([question, answer], index) => <FaqItem key={question} number={String(index + 1).padStart(2, "0")} question={question} answer={answer} />)}</div>;
}
