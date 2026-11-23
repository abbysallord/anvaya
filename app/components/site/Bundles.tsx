import Link from "next/link";
import { audiences, bundles, foundingOffer, type Audience } from "../../lib/site";
import { CurrencySwitch, Money } from "./Currency";
import { ArrowUpRight, Check } from "./icons";

/** Pricing as bundles, both audiences one after the other, each with its own clear heading. `path` adds the
    audience's customer journey above its cards (the Bundles page; Home explains it in its own section). */
export function Bundles({ path = false, number }: { path?: boolean; number?: string }) {
  return <section className="bundles" id="bundles" aria-labelledby="bundles-title">
    <div className="shell">
      <div className="bundles-intro">
        {number && <p className="label"><b>{number}</b> / Pricing</p>}
        <h2 id="bundles-title" className="display">One kit. One price. <em>Everything connected.</em></h2>
        <p className="lede">Each bundle is a fixed price for a finished result, with a set delivery time and two rounds of changes. It costs less than buying the same parts separately.</p>
        <CurrencySwitch />
      </div>
      {(Object.keys(audiences) as Audience[]).map(key => {
        const set = audiences[key], items = bundles.filter(b => b.audience === key);
        return <div className="bundle-set" id={key} key={key}>
          <div className="bundle-set-head">
            <p className="label"><b>{set.label}</b></p>
            <h3>{set.title}</h3>
            <p>{set.lede}</p>
          </div>
          {path && <ol className="bundle-path" data-stagger="60">{set.journey.map(([step, detail], i) => <li key={step}><span>{String(i + 1).padStart(2, "0")}</span><b>{step}</b><p>{detail}</p></li>)}</ol>}
          <div className={`bundle-grid bundle-grid-${items.length}`}>
            {items.map(b => <article className={`bundle${b.featured ? " is-featured on-ink" : ""}`} key={b.id}>
              {b.featured && <p className="bundle-flag">Recommended</p>}
              <header>
                <h4>{b.name}</h4>
                <p className="bundle-promise">{b.promise}</p>
              </header>
              <p className="bundle-price">{b.price.startsWith("from ") && <span className="bundle-from">from</span>}<b><Money text={b.price.replace(/^from /, "")} /></b>{b.monthly && <span><Money text={b.monthly} /></span>}</p>
              <dl className="bundle-facts"><div><dt>Covers</dt><dd>{b.unit}</dd></div><div><dt>Delivery</dt><dd>{b.timeline}</dd></div></dl>
              <ul className="bundle-list">{b.includes.map(item => <li key={item}><Check />{item}</li>)}</ul>
              <Link href={`/project?bundle=${b.id}`} className={`btn ${b.featured ? "btn-light" : "btn-ghost"} btn-block`}>Choose {b.name}<ArrowUpRight /></Link>
            </article>)}
          </div>
        </div>;
      })}
      <div className="bundles-foot" data-rise>
        <p><b>{foundingOffer.title}.</b> {foundingOffer.detail}</p>
        <p className="intl-note">Prices in US dollars. Quotes are also available in EUR, GBP, AED or INR for the same scope.</p>
        <Link href="/pricing" className="btn btn-ghost">Full price list and terms<ArrowUpRight /></Link>
      </div>
    </div>
  </section>;
}
