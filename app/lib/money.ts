/** Prices are published in US dollars. INR is a conversion at a fixed, dated reference rate, rounded,
    and labelled as indicative: the written quote fixes the amount. Update FX when refreshing prices. */
export const FX = { inr: 93.48, date: "17 November 2026", source: "European Central Bank reference rate" } as const;
export type Currency = "USD" | "INR";

export function toINR(usd: number): number {
  const v = usd * FX.inr;
  const step = v >= 100000 ? 5000 : v >= 10000 ? 1000 : 500;
  return Math.round(v / step) * step;
}
const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

/** Rewrites every "$1,500" in a price string into rupees; USD text passes through unchanged. */
export function convertText(text: string, currency: Currency): string {
  if (currency === "USD") return text;
  return text.replace(/\$([\d,]+(?:\.\d+)?)/g, (_, n: string) => inr(toINR(parseFloat(n.replace(/,/g, "")))));
}
