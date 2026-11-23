/** A hairline that fans into a small peacock eye: the brand's divider. Decorative only. */
export function FeatherRule({ className = "" }: { className?: string }) {
  return <svg className={`feather-rule ${className}`} viewBox="0 0 240 24" preserveAspectRatio="xMinYMid meet" aria-hidden="true" focusable="false">
    <path d="M0 12H196" className="fr-shaft" />
    {[-1, -0.6, -0.2, 0.2, 0.6, 1].map((k, i) => <path key={i} d={`M${150 + i * 7} 12 L${168 + i * 6} ${12 + k * 7}`} className="fr-barb" />)}
    <path className="logo-eye-ring" d="M214 4.5c5.6 4 7 7.6 7 10.2a7 7 0 0 1-14 0c0-2.6 1.4-6.2 7-10.2Z" />
    <path className="logo-eye-body" d="M214 7.8c3.9 3 4.8 5.6 4.8 7.4a4.8 4.8 0 0 1-9.6 0c0-1.8.9-4.4 4.8-7.4Z" />
    <ellipse className="logo-eye-core" cx="214" cy="15.5" rx="2.5" ry="2.9" />
  </svg>;
}
