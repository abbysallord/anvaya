import type { SVGProps } from "react";

const base = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true } as const;
type P = SVGProps<SVGSVGElement>;

export const ArrowUpRight = (p: P) => <svg {...base} className="arrow" {...p}><path d="M7 17 17 7M8 7h9v9" /></svg>;
export const ArrowRight = (p: P) => <svg {...base} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
export const Drag = (p: P) => <svg {...base} {...p}><path d="M8 12H3m0 0 2.5-2.5M3 12l2.5 2.5M16 12h5m0 0-2.5-2.5M21 12l-2.5 2.5" /><circle cx="12" cy="12" r="2.2" /></svg>;
export const Home = (p: P) => <svg {...base} {...p}><path d="M4 11.5 12 5l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5h-5v5H5a1 1 0 0 1-1-1z" /></svg>;
export const Layers = (p: P) => <svg {...base} {...p}><path d="m12 4 8 4.5-8 4.5-8-4.5zM4 13l8 4.5 8-4.5" /></svg>;
export const Grid = (p: P) => <svg {...base} {...p}><rect x="4" y="4" width="7" height="7" rx="1.6" /><rect x="13" y="4" width="7" height="7" rx="1.6" /><rect x="4" y="13" width="7" height="7" rx="1.6" /><rect x="13" y="13" width="7" height="7" rx="1.6" /></svg>;
export const Chat = (p: P) => <svg {...base} {...p}><path d="M20 12a7.5 7.5 0 0 1-11 6.6L4.5 20l1.3-4.2A7.5 7.5 0 1 1 20 12z" /></svg>;
export const Send = (p: P) => <svg {...base} {...p}><path d="M5 12 19 5l-4.5 14-3-6z" /><path d="m11.5 13 3-3" /></svg>;
export const Close = (p: P) => <svg {...base} {...p}><path d="M6 6l12 12M18 6 6 18" /></svg>;
export const Check = (p: P) => <svg {...base} {...p}><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>;
export const Plus = (p: P) => <svg {...base} {...p}><path d="M12 5v14M5 12h14" /></svg>;
export const WhatsApp = (p: P) => <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}><path d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.5-1.2A9 9 0 1 0 12 3zm0 1.7a7.3 7.3 0 1 1-3.9 13.5l-.3-.2-2.4.7.7-2.3-.2-.3A7.3 7.3 0 0 1 12 4.7zM9.2 7.9c-.2 0-.4 0-.6.3-.2.2-.9.8-.9 2s.9 2.400 1 2.500c.1.2 1.800 2.800 4.400 3.800 2.200.9 2.600.7 3.100.7.500 0 1.500-.6 1.700-1.200.2-.6.2-1.100.2-1.200-.1-.1-.2-.2-.5-.3l-1.700-.8c-.2-.1-.4-.1-.6.100l-.8 1c-.1.2-.3.2-.5.1-.3-.1-1.100-.4-2-1.300-.8-.7-1.300-1.500-1.400-1.800-.2-.2 0-.4.1-.5l.4-.4.2-.4c.1-.200 0-.300 0-.500l-.8-1.800c-.2-.4-.4-.4-.500-.400z" /></svg>;
