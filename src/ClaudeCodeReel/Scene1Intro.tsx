import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "./colors";
import { FEATURE } from "./config";
import { ClaudeCodeWordmark } from "./Logos";
import { Background, gradientText, pillBadge } from "./Background";

export const Scene1Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const badgeOpacity = interpolate(frame, [15, 38], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const badgeY = interpolate(spring({ frame: frame - 15, fps, config: { damping: 90, stiffness: 130 } }), [0, 1], [-30, 0]);

  const eyebrowOpacity = interpolate(frame, [30, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const words = FEATURE.title.split(" ");
  const titleWords = words.map((word, i) => {
    const delay = 45 + i * 14;
    const s = spring({ frame: frame - delay, fps, config: { damping: 70, stiffness: 200 } });
    return {
      word,
      y: interpolate(s, [0, 1], [50, 0]),
      opacity: interpolate(frame, [delay, delay + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    };
  });

  const lineWidth = interpolate(spring({ frame: frame - 85, fps, config: { damping: 100 } }), [0, 1], [0, 420]);

  const subtitleY = interpolate(spring({ frame: frame - 98, fps, config: { damping: 100, stiffness: 130 } }), [0, 1], [30, 0]);
  const subtitleOpacity = interpolate(frame, [98, 122], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const logoOpacity = interpolate(frame, [8, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Floating particles
  const particles = Array.from({ length: 20 }, (_, i) => ({
    x: (i * 113 + 55) % 1080,
    y: (i * 149 + 70) % 1920,
    size: 2 + (i % 3) * 1.5,
    speed: 0.1 + (i % 5) * 0.06,
    color: i % 3 === 0 ? "#2997FF" : i % 3 === 1 ? "#34d399" : "#a78bfa",
    opacity: 0.25 + (i % 3) * 0.12,
  }));

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Background frame={frame} />

      {/* Particles */}
      {particles.map((p, i) => {
        const py = ((p.y - frame * p.speed * 38) % 1920 + 1920) % 1920;
        const pulse = p.opacity + Math.sin((frame + i * 20) * 0.06) * 0.12;
        return (
          <div key={i} style={{
            position: "absolute", left: p.x, top: py,
            width: p.size, height: p.size, borderRadius: "50%",
            backgroundColor: p.color, opacity: Math.max(0, Math.min(1, pulse)),
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
          }} />
        );
      })}

      {/* Top wordmark */}
      <div style={{
        position: "absolute", top: 80, left: 0, right: 0,
        display: "flex", justifyContent: "center", opacity: logoOpacity,
      }}>
        <ClaudeCodeWordmark size={22} color="#2997FF" showIcon />
      </div>

      {/* Center content */}
      <AbsoluteFill style={{
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", padding: "0 70px",
      }}>
        {/* Open source badge */}
        <div style={{ ...pillBadge, transform: `translateY(${badgeY}px)`, opacity: badgeOpacity, marginBottom: 40 }}>
          <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#34d399", boxShadow: "0 0 8px #34d399" }} />
          <span style={{ fontFamily: COLORS.sans, fontSize: 22, fontWeight: 600, color: "#64d2ff", letterSpacing: 3 }}>
            {FEATURE.badge}
          </span>
        </div>

        {/* Eyebrow */}
        <div style={{ fontFamily: COLORS.sans, fontSize: 28, fontWeight: 500, color: "#2997FF", letterSpacing: 6, marginBottom: 20, opacity: eyebrowOpacity }}>
          CLAUDE CODE
        </div>

        {/* Title — word-by-word with gradient */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16 }}>
          {titleWords.map(({ word, y, opacity }, i) => (
            <div key={i} style={{
              transform: `translateY(${y}px)`,
              opacity,
              fontSize: 130,
              fontWeight: 900,
              fontFamily: COLORS.sans,
              lineHeight: 0.95,
              letterSpacing: -5,
              ...gradientText,
            }}>
              {word}
            </div>
          ))}
        </div>

        {/* Gradient divider */}
        <div style={{
          width: lineWidth, height: 3, marginTop: 32, marginBottom: 36,
          background: "linear-gradient(90deg, transparent, #2997FF, #34d399, transparent)",
          borderRadius: 2, boxShadow: "0 0 16px rgba(41,151,255,0.5)",
        }} />

        {/* Subtitle */}
        <div style={{
          transform: `translateY(${subtitleY}px)`,
          opacity: subtitleOpacity,
          fontFamily: COLORS.sans, fontSize: 36, fontWeight: 400,
          color: "rgba(255,255,255,0.55)", textAlign: "center",
          lineHeight: 1.55, whiteSpace: "pre-line",
        }}>
          {FEATURE.subtitle}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
