/** Anvaya mark: the letters A and N joined by a thread. The A's crossbar runs out as one thread and ends in a
    peacock eye threaded on the N's stem. Anvaya means connection, the order that joins many parts into one whole;
    a peacock eye is that idea made visible: thousands of separate barbs aligned into one pattern. Its centre is
    also a viewpoint that looks every way, like a 360° walkthrough. Ring: gold, body: peacock teal, core: morpho blue. */
export function LogoMark({ className = "", barbs = false }: { className?: string; barbs?: boolean }) {
  return <svg className={`logo-mark ${className}`} viewBox="0 0 64 64" fill="none" aria-hidden="true" focusable="false">
    <path className="logo-arch" d="M6 52 20 12 34 52" pathLength="1" />
    <path className="logo-n" d="M44 52V12L58 52V12" pathLength="1" />
    <path className="logo-thread" d="M12 38H36.5" pathLength="1" />
    {barbs && <g className="logo-barbs">
      {[-62, -40, -18, 18, 40, 62].map(a => <path key={a} d="M44 26.5V20.5" transform={`rotate(${a} 44 39)`} pathLength="1" />)}
    </g>}
    <g className="logo-eye">
      <path className="logo-eye-ring" d="M44 27.5C50.6 32.6 52.2 37.2 52.2 40.4A8.2 8.2 0 0 1 35.8 40.4C35.8 37.2 37.4 32.6 44 27.5Z" />
      <path className="logo-eye-body" d="M44 31.4C48.7 35.1 49.7 38.4 49.7 40.7A5.7 5.7 0 0 1 38.3 40.7C38.3 38.4 39.3 35.1 44 31.4Z" />
      <ellipse className="logo-eye-core" cx="44" cy="41.1" rx="3.05" ry="3.45" />
      <circle className="logo-eye-glint" cx="45.1" cy="39.9" r=".9" />
    </g>
  </svg>;
}

/** Tracked wordmark whose full stop is the terracotta bindu. */
export function Wordmark({ className = "" }: { className?: string }) {
  return <span className={`wordmark ${className}`}>ANVAYA<i aria-hidden="true">.</i></span>;
}
