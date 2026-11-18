"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { studioSamples } from "../../lib/site";
import { ArrowUpRight } from "./icons";
import { FeatherRule } from "./FeatherRule";

type Sample = (typeof studioSamples)[number];

/** Works showcase: each walkthrough shown on a laptop and a phone. Screens cross-fade between rooms,
    the laptop opens and the phone rises as the row enters, and "Try it live" loads the real tour inside
    the laptop. Everything is plain HTML and CSS; reduced motion keeps the first frame and no movement. */
export function Showcase({ number = "01" }: { number?: string }) {
  return <section className="showcase" id="work" aria-labelledby="showcase-title">
    <div className="shell">
      <header className="showcase-head">
        <p className="label"><b>{number}</b> / Works</p>
        <h2 id="showcase-title" className="showcase-title" data-nosplit>Walk through it <em>before it&rsquo;s built.</em></h2>
        <FeatherRule />
        <p className="showcase-lede">Every home below started as a floor plan. Open one on your phone or laptop and walk it room by room, the way your buyers will.</p>
      </header>
      <ol className="showcase-list">
        {studioSamples.map((s, i) => <ShowcaseRow key={s.id} sample={s} flip={i % 2 === 1} />)}
      </ol>
      <p className="showcase-note">Studio samples, designed by Anvaya from floor plans. Client work is shown only with written permission.</p>
    </div>
  </section>;
}

function ShowcaseRow({ sample: s, flip }: { sample: Sample; flip: boolean }) {
  const row = useRef<HTMLLIElement>(null);
  const [live, setLive] = useState(false);
  useEffect(() => {
    const el = row.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { el.classList.add("is-in"); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("is-in"); io.disconnect(); } },
      { rootMargin: "0px 0px -15% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const base = `/work/devices/${s.id}`;
  return <li ref={row} className={`showcase-row${flip ? " flip" : ""}`} id={s.id}>
    <div className="devices" aria-hidden={live ? undefined : true}>
      <div className="laptop">
        <div className="laptop-lid">
          <div className="laptop-screen">
            {live
              ? <iframe src={s.tour} title={`${s.name}: live walkthrough`} allow="fullscreen; gyroscope; accelerometer" loading="lazy" />
              : <div className="screen-cycle" style={{ ["--n" as string]: s.devices.wide.length }}>
                  {s.devices.wide.map((r, k) => <img key={r} src={`${base}/${r}-wide.webp`} width={1600} height={1000} alt=""
                    style={{ ["--k" as string]: k }} loading={k === 0 ? "eager" : "lazy"} decoding="async" />)}
                </div>}
          </div>
        </div>
        <div className="laptop-base"><span /></div>
      </div>
      <div className="phone">
        <div className="phone-screen">
          <span className="phone-island" />
          <div className="screen-cycle" style={{ ["--n" as string]: s.devices.tall.length }}>
            {s.devices.tall.map((r, k) => <img key={r} src={`${base}/${r}-tall.webp`} width={720} height={1560} alt=""
              style={{ ["--k" as string]: k }} loading={k === 0 ? "eager" : "lazy"} decoding="async" />)}
          </div>
        </div>
      </div>
    </div>
    <div className="showcase-copy">
      <p className="showcase-kind">{s.kind}</p>
      <h3 className="showcase-name">{s.name}</h3>
      <p>{s.line}</p>
      <dl className="showcase-facts">
        {s.facts.map(([value, label]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
      </dl>
      <div className="showcase-actions">
        <a href={s.tour} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Open walkthrough<ArrowUpRight /></a>
        <button type="button" className="btn btn-ghost try-live" onClick={() => setLive(true)} disabled={live}
          aria-label={`Load the ${s.name} walkthrough inside the laptop on this page`}>{live ? "Live in the laptop" : "Try it live"}</button>
        <Link href={`/work#${s.id}`} className="showcase-more">Details</Link>
      </div>
    </div>
  </li>;
}
