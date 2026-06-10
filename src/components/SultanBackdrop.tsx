import { useMemo } from "react";

export function SultanBackdrop() {
  const stars = useMemo(
    () =>
      Array.from({ length: 80 }, (_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        delay: Math.random() * 3,
      })),
    [],
  );

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Starfield */}
      {stars.map((s) => (
        <span
          key={s.id}
          className="sultan-twinkle absolute rounded-full bg-white"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}

      {/* Crystalline orbs */}
      <div className="sultan-float absolute -top-32 -left-24 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(167,139,250,0.35),transparent_70%)] blur-3xl" />
      <div
        className="sultan-float absolute -bottom-32 -right-24 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(245,210,122,0.25),transparent_70%)] blur-3xl"
        style={{ animationDelay: "2s" }}
      />

      {/* Solomon seal — slowly rotating */}
      <svg
        className="sultan-spin-slow absolute left-1/2 top-1/2 h-[120vmin] w-[120vmin] -translate-x-1/2 -translate-y-1/2 opacity-[0.06]"
        viewBox="0 0 200 200"
        fill="none"
      >
        <polygon
          points="100,10 117,70 180,70 130,108 148,170 100,135 52,170 70,108 20,70 83,70"
          stroke="#f5d27a"
          strokeWidth="0.5"
        />
        <polygon
          points="100,190 83,130 20,130 70,92 52,30 100,65 148,30 130,92 180,130 117,130"
          stroke="#f5d27a"
          strokeWidth="0.5"
        />
        <circle cx="100" cy="100" r="90" stroke="#a78bfa" strokeWidth="0.3" />
        <circle cx="100" cy="100" r="70" stroke="#a78bfa" strokeWidth="0.3" />
      </svg>

      {/* Crystalline mesh overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(60deg, transparent 49%, #f5d27a 50%, transparent 51%), linear-gradient(-60deg, transparent 49%, #a78bfa 50%, transparent 51%)",
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}
