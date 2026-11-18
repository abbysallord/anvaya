"use client";
import { useSyncExternalStore } from "react";
import { FX, convertText, type Currency } from "../../lib/money";

const KEY = "anvaya-currency";
const EVENT = "anvaya-currency";
function read(): Currency {
  try { return localStorage.getItem(KEY) === "INR" ? "INR" : "USD"; } catch { return "USD"; }
}
function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb); window.addEventListener("storage", cb);
  return () => { window.removeEventListener(EVENT, cb); window.removeEventListener("storage", cb); };
}
export function useCurrency(): Currency {
  return useSyncExternalStore(subscribe, read, () => "USD");
}
function set(c: Currency) {
  try { localStorage.setItem(KEY, c); } catch { /* private mode: still switch for this page view */ }
  window.dispatchEvent(new Event(EVENT));
}

/** A price string in USD ("from $6,000", "+ $60 / month"), shown in the visitor's chosen currency. */
export function Money({ text }: { text: string }) {
  return <>{convertText(text, useCurrency())}</>;
}

/** USD / INR switch. USD is the default; the choice is remembered on this device. */
export function CurrencySwitch({ className = "" }: { className?: string }) {
  const cur = useCurrency();
  return <div className={`currency-switch ${className}`}>
    <div role="group" aria-label="Show prices in">
      {(["USD", "INR"] as const).map(c => <button key={c} type="button" aria-pressed={cur === c} onClick={() => set(c)}>{c}</button>)}
    </div>
    {cur === "INR" && <p className="currency-note">Converted at ₹{FX.inr} per US dollar ({FX.source}, {FX.date}), rounded. Your written quote fixes the final amount.</p>}
  </div>;
}
