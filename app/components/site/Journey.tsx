import { audiences } from "../../lib/site";
import { Check } from "./icons";

const steps = audiences.developers.journey;

/* Five illustrative phone screens, one per step. They are drawings of the flow, not client data. */
function Screen({ index }: { index: number }) {
  if (index === 0) return <div className="ps ps-scan">
    <p className="ps-kicker">Brochure · back cover</p>
    <div className="ps-qr" aria-hidden="true">{Array.from({ length: 49 }, (_, i) => <i key={i} data-on={[0, 1, 2, 4, 6, 7, 9, 12, 13, 14, 16, 18, 20, 22, 23, 26, 27, 29, 30, 32, 34, 35, 36, 39, 41, 42, 44, 46, 47, 48].includes(i)} />)}</div>
    <p className="ps-title">Scan to walk through the 3BHK</p>
  </div>;
  if (index === 1) return <div className="ps ps-walk">
    <img src="/work/westroad/still-living.webp" alt="" loading="lazy" decoding="async" />
    <div className="ps-chips"><span data-on="true">Living</span><span>Dining</span><span>Bedroom</span></div>
  </div>;
  if (index === 2) return <div className="ps ps-ask">
    <p className="ps-kicker">Project website</p>
    <p className="ps-title">Ask about this flat</p>
    <div className="ps-field"><span>Name</span><b>Kiran</b></div>
    <div className="ps-field ps-area"><span>Question</span><b>Is the east-facing 3BHK still available?</b></div>
    <div className="ps-send">Send enquiry</div>
  </div>;
  if (index === 3) return <div className="ps ps-chat">
    <p className="ps-chat-head"><i />Your sales desk</p>
    <p className="ps-bubble ps-in">Is the east-facing 3BHK still available?</p>
    <p className="ps-bubble ps-out">Yes, it is. Here is the walkthrough and floor plan. <span>Replied in under a minute</span></p>
    <p className="ps-bubble ps-in">Can I visit Saturday, 11 am?</p>
  </div>;
  return <div className="ps ps-sheet">
    <p className="ps-kicker">Lead sheet · this week</p>
    {[["Kiran", "Site visit · Sat 11:00", "ok"], ["Meena", "Sent price sheet", ""], ["Sana", "Site visit · Sun 16:30", "ok"]].map(([name, status, tone]) =>
      <div className="ps-row" key={name}><b>{name}</b><span data-tone={tone}>{tone && <Check />}{status}</span></div>)}
  </div>;
}

/** How a launch kit works: five steps in reading order, each with its screen. A row on desktop, a swipe row on phones. */
export function Journey() {
  return <section className="kit on-ink" id="how" aria-labelledby="kit-title">
    <div className="shell">
      <div className="kit-head">
        <p className="label"><b>03</b> / How it works</p>
        <h2 id="kit-title" className="display">From a brochure to a booked <em>site visit.</em></h2>
        <p className="lede">What your buyer sees, step by step, once a launch kit is live.</p>
      </div>
      <ol className="kit-steps" data-stagger="90">
        {steps.map(([title, detail], i) => <li key={title} className="kit-step">
          <div className="kit-step-screen" aria-hidden="true"><div className="phone"><div className="phone-screen"><Screen index={i} /></div></div></div>
          <div className="kit-step-copy">
            <span className="kit-step-number">{String(i + 1).padStart(2, "0")}</span>
            <h3>{title}</h3>
            <p>{detail}</p>
          </div>
        </li>)}
      </ol>
      <p className="kit-example">Illustrative screens</p>
    </div>
  </section>;
}
