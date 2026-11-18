"use client";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { animate } from "animejs";
import { askAnvaya, type AssistantTurn } from "../../assistant/actions";
import { contact } from "../../lib/site";
import { ASSISTANT_OPEN, reducedMotion } from "../../lib/anim";
import { Chat, Close, Send, WhatsApp } from "./icons";

const starters = ["Which bundle fits a 40-flat project?", "What does Launch Pro include?", "How do payments work?"];
const failures = {
  unavailable: "The assistant is not available right now. Send us your question through the project form and a person will reply.",
  busy: "That is a lot of questions in a short time. Please try again in a few minutes, or use the project form.",
  invalid: "I could not read that message. Please try again.",
} as const;

/** Site assistant. Desktop: a button in the corner opens a panel. Phones: the dock's Ask button opens it as a sheet.
    It answers only from the published bundles, prices and terms, and always offers a way to reach a person. */
export function Assistant() {
  const [open, setOpen] = useState(false);
  const [turns, setTurns] = useState<AssistantTurn[]>([]);
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState("");
  const [draft, setDraft] = useState("");
  const panel = useRef<HTMLDivElement>(null);
  const log = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const opener = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener(ASSISTANT_OPEN, show);
    return () => window.removeEventListener(ASSISTANT_OPEN, show);
  }, []);
  useEffect(() => {
    if (!open) return;
    document.documentElement.dataset.assistant = "open";
    if (panel.current && !reducedMotion()) animate(panel.current, { opacity: [0, 1], y: [24, 0], duration: 420, ease: "outExpo" });
    input.current?.focus({ preventScroll: true });
    const key = (event: KeyboardEvent) => { if (event.key === "Escape") { setOpen(false); opener.current?.focus(); } };
    window.addEventListener("keydown", key);
    return () => { window.removeEventListener("keydown", key); delete document.documentElement.dataset.assistant; };
  }, [open]);
  useEffect(() => { log.current?.scrollTo({ top: log.current.scrollHeight }); }, [turns, pending, notice]);

  async function ask(question: string) {
    const text = question.trim();
    if (!text || pending) return;
    const next: AssistantTurn[] = [...turns, { role: "user", content: text.slice(0, 600) }];
    setTurns(next); setDraft(""); setNotice(""); setPending(true);
    try {
      const reply = await askAnvaya(next);
      if (reply.ok) setTurns([...next, { role: "assistant", content: reply.text }]);
      else setNotice(failures[reply.reason]);
    } catch { setNotice(failures.unavailable); }
    setPending(false);
  }
  const submit = (event: FormEvent) => { event.preventDefault(); void ask(draft); };

  return <>
    <button ref={opener} type="button" className="assist-fab" aria-expanded={open} aria-controls="assistant-panel" onClick={() => setOpen(value => !value)}>
      {open ? <Close /> : <Chat />}<span>{open ? "Close" : "Ask Anvaya"}</span>
    </button>
    {open && <div className="assist" id="assistant-panel" ref={panel} role="dialog" aria-label="Ask Anvaya">
      <header className="assist-head">
        <div><p className="assist-title">Ask Anvaya</p><p className="assist-sub">AI assistant · answers from our published prices and terms</p></div>
        <button type="button" className="assist-close" aria-label="Close assistant" onClick={() => setOpen(false)}><Close /></button>
      </header>
      <div className="assist-log" ref={log} aria-live="polite">
        {!turns.length && <div className="assist-empty">
          <p>Ask about bundles, prices, timelines or how a project runs.</p>
          <div className="assist-starters">{starters.map(s => <button key={s} type="button" onClick={() => { void ask(s); }}>{s}</button>)}</div>
        </div>}
        {turns.map((turn, i) => <p key={i} className={`assist-msg assist-${turn.role}`}>{turn.content}</p>)}
        {pending && <p className="assist-msg assist-assistant assist-typing" aria-label="Writing a reply"><i /><i /><i /></p>}
        {notice && <p className="assist-notice" role="status">{notice}</p>}
      </div>
      <div className="assist-handoff">
        {contact.whatsapp && <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-wa"><WhatsApp />WhatsApp a person</a>}
        <Link href="/project" className="btn btn-ghost" onClick={() => setOpen(false)}>Project form</Link>
      </div>
      <form className="assist-form" onSubmit={submit}>
        <label className="sr-only" htmlFor="assistant-input">Your question</label>
        <textarea id="assistant-input" ref={input} rows={1} maxLength={600} placeholder="Type your question" value={draft} onChange={event => setDraft(event.target.value)}
          onKeyDown={event => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void ask(draft); } }} />
        <button type="submit" aria-label="Send" disabled={pending || !draft.trim()}><Send /></button>
      </form>
      <p className="assist-legal">A person confirms every quote in writing. See our <Link href="/privacy" onClick={() => setOpen(false)}>privacy notice</Link>.</p>
    </div>}
  </>;
}
