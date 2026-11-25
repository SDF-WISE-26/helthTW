import type { CSSProperties } from "react";

// Abstract placeholder art for the topic cards until real images exist.
// White and ochre shapes, so every variant works on every topic colour.

const variants = [
  // Rising sun
  <>
    <circle cx="96" cy="112" r="70" fill="white" fillOpacity="0.1" />
    <circle cx="96" cy="112" r="48" fill="white" fillOpacity="0.14" />
    <circle cx="96" cy="112" r="28" fill="var(--ochre-300)" />
    <path d="M40 30l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" fill="white" fillOpacity="0.8" />
  </>,
  // Two circles leaning on each other
  <>
    <circle cx="70" cy="70" r="40" fill="white" fillOpacity="0.16" />
    <circle cx="110" cy="84" r="34" fill="var(--ochre-300)" fillOpacity="0.9" />
    <circle cx="44" cy="26" r="5" fill="white" fillOpacity="0.8" />
  </>,
  // Arcs reaching out
  <>
    <path d="M30 120a90 90 0 0 1 180 0" stroke="white" strokeOpacity="0.12" strokeWidth="16" />
    <path d="M56 120a64 64 0 0 1 128 0" stroke="white" strokeOpacity="0.2" strokeWidth="16" />
    <path d="M82 120a38 38 0 0 1 76 0" stroke="var(--ochre-300)" strokeWidth="16" />
    <circle cx="36" cy="40" r="5" fill="white" fillOpacity="0.8" />
  </>,
  // Ripples
  <>
    <circle cx="110" cy="60" r="54" stroke="white" strokeOpacity="0.12" strokeWidth="10" />
    <circle cx="110" cy="60" r="34" stroke="white" strokeOpacity="0.2" strokeWidth="10" />
    <circle cx="110" cy="60" r="14" fill="var(--ochre-300)" />
  </>,
];

export function TopicArt({
  variant,
  className,
  style,
}: {
  variant: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 140 120"
      fill="none"
      preserveAspectRatio="xMaxYMid slice"
      aria-hidden="true"
      className={className}
      style={style}
    >
      {variants[variant % variants.length]}
    </svg>
  );
}
