// The little vinyl record that shows up in the corner of almost every page.
// `color` sets the label color in the middle — each project picks its own
// (vinylColor in the data file). `size` lets me drop the same component
// into different spots at different scales without needing media queries.
// It's aria-hidden because it's decoration, not content — screen readers
// should skip past it.
export default function Vinyl({ color = "#C97B3C", size = 130, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 130 130"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`vinylShine-${color}`} cx="35%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#3a3a3a" />
          <stop offset="55%" stopColor="#0f0f0f" />
          <stop offset="100%" stopColor="#000" />
        </radialGradient>
      </defs>
      <circle cx="65" cy="65" r="64" fill={`url(#vinylShine-${color})`} />
      {Array.from({ length: 14 }).map((_, i) => (
        <circle
          key={i}
          cx="65"
          cy="65"
          r={20 + i * 3}
          fill="none"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="0.6"
        />
      ))}
      <circle cx="65" cy="65" r="18" fill={color} />
      <circle cx="65" cy="65" r="3" fill="#1a1a1a" />
    </svg>
  );
}
