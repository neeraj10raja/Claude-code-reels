import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "./colors";
import { FEATURE } from "./config";
import { ClaudeCodeWordmark, HookDecorationSVG } from "./Logos";

export const Scene1Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animated mesh blobs
  const blob1X = Math.sin(frame * 0.018) * 80;
  const blob1Y = Math.cos(frame * 0.014) * 60;
  const blob2X = Math.cos(frame * 0.022) * 70;
  const blob2Y = Math.sin(frame * 0.016) * 50;

  // Badge
  const badgeY = interpolate(spring({ frame: frame - 20, fps, config: { damping: 90, stiffness: 130 } }), [0, 1], [-40, 0]);
  const badgeOpacity = interpolate(frame, [20, 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Title — each word staggers in
  const words = FEATURE.title.split(" ");
  const titleWords = words.map((word, i) => {
    const delay = 45 + i * 12;
    const s = spring({ frame: frame - delay, fps, config: { damping: 70, stiffness: 200 } });
    return {
      word,
      scale: interpolate(s, [0, 1], [0.5, 1]),
      opacity: interpolate(frame, [delay, delay + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      y: interpolate(s, [0, 1], [40, 0]),
    };
  });

  // Glow ring
  const ringScale = spring({ frame: frame - 40, fps, config: { damping: 60, stiffness: 120 } });
  const ringOpacity = interpolate(frame, [40, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ringPulse = 1 + Math.sin(frame * 0.05) * 0.04;

  // Divider
  const lineWidth = interpolate(spring({ frame: frame - 90, fps, config: { damping: 100 } }), [0, 1], [0, 360]);

  // Subtitle
  const subtitleY = interpolate(spring({ frame: frame - 100, fps, config: { damping: 100, stiffness: 130 } }), [0, 1], [30, 0]);
  const subtitleOpacity = interpolate(frame, [100, 125], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Top watermark
  const watermarkOpacity = interpolate(frame, [10, 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Hook decoration
  const hookOpacity = interpolate(frame, [30, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const hookRotate = frame * 0.08;

  // Floating particles
  const particles = Array.from({ length: 24 }, (_, i) => ({
    x: (i * 113 + 55) % 1080,
    y: (i * 149 + 70) % 1920,
    size: 1.5 + (i % 3) * 1.5,
    delay: i * 6,
    speed: 0.12 + (i % 6) * 0.08,
    color: i % 4 === 0 ? COLORS.blue : i % 4 === 1 ? COLORS.purple : i % 4 === 2 ? COLORS.green : COLORS.gold,
    opacity: 0.3 + (i % 3) * 0.15,
  }));

  return (
    <AbsoluteFill style={{ background: COLORS.bg, overflow: "hidden" }}>
      {/* Animated gradient mesh */}
      <AbsoluteFill>
        <div style={{
          position: "absolute",
          width: 900, height: 900,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(41,151,255,0.18) 0%, transparent 65%)",
          left: "50%", top: "35%",
          transform: `translate(calc(-50% + ${blob1X}px), calc(-50% + ${blob1Y}px))`,
          filter: "blur(60px)",
        }} />
        <div style={{
          position: "absolute",
          width: 700, height: 700,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(167,139,250,0.14) 0%, transparent 65%)",
          left: "50%", top: "50%",
          transform: `translate(calc(-50% + ${blob2X}px), calc(-50% + ${blob2Y}px))`,
          filter: "blur(80px)",
        }} />
      </AbsoluteFill>

      {/* Subtle dot grid */}
      <AbsoluteFill style={{ opacity: 0.12 }}>
        <svg width="1080" height="1920">
          {Array.from({ length: 18 }, (_, col) =>
            Array.from({ length: 32 }, (_, row) => (
              <circle key={`${col}-${row}`}
                cx={col * 64 + 32} cy={row * 64 + 32}
                r={1.2} fill={COLORS.blue} opacity={0.6}
              />
            ))
          )}
        </svg>
      </AbsoluteFill>

      {/* Floating particles */}
      {particles.map((p, i) => {
        const py = ((p.y - frame * p.speed * 40) % 1920 + 1920) % 1920;
        const pulse = p.opacity + Math.sin((frame + p.delay) * 0.07) * 0.15;
        return (
          <div key={i} style={{
            position: "absolute",
            left: p.x, top: py,
            width: p.size, height: p.size,
            borderRadius: "50%",
            backgroundColor: p.color,
            opacity: Math.max(0, Math.min(1, pulse)),
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
          }} />
        );
      })}

      {/* Top watermark — Claude Code logo */}
      <div style={{
        position: "absolute",
        top: 72, left: 0, right: 0,
        display: "flex",
        justifyContent: "center",
        opacity: watermarkOpacity,
      }}>
        <ClaudeCodeWordmark size={22} color={COLORS.blue} showIcon />
      </div>

      {/* Decorative hook SVG — large, behind glow ring */}
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          transform: `rotate(${hookRotate}deg)`,
          opacity: hookOpacity,
        }}>
          <HookDecorationSVG size={500} opacity={0.09} color={COLORS.blue} />
        </div>
      </AbsoluteFill>

      {/* Glow ring behind title */}
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          width: 500, height: 500,
          borderRadius: "50%",
          border: `1px solid rgba(41,151,255,0.2)`,
          boxShadow: `0 0 80px rgba(41,151,255,0.12), inset 0 0 80px rgba(41,151,255,0.06)`,
          transform: `scale(${interpolate(ringScale, [0, 1], [0.4, 1]) * ringPulse})`,
          opacity: ringOpacity,
        }} />
      </AbsoluteFill>

      {/* Center content */}
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 64px" }}>

        {/* Badge */}
        <div style={{
          transform: `translateY(${badgeY}px)`,
          opacity: badgeOpacity,
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "rgba(41,151,255,0.1)",
          border: "1px solid rgba(41,151,255,0.35)",
          borderRadius: 100,
          padding: "10px 28px",
          marginBottom: 48,
          backdropFilter: "blur(8px)",
        }}>
          <div style={{
            width: 7, height: 7, borderRadius: "50%",
            background: COLORS.blue,
            boxShadow: `0 0 8px ${COLORS.blue}`,
          }} />
          <span style={{
            fontFamily: COLORS.sans,
            fontSize: 18,
            fontWeight: 600,
            color: COLORS.blue,
            letterSpacing: 2,
            textTransform: "uppercase" as const,
          }}>
            {FEATURE.badge}
          </span>
        </div>

        {/* Title — word-by-word reveal */}
        <div style={{ display: "flex", flexWrap: "wrap" as const, justifyContent: "center", gap: 12, marginBottom: 8 }}>
          {titleWords.map(({ word, scale, opacity, y }, i) => (
            <div key={i} style={{
              transform: `translateY(${y}px) scale(${scale})`,
              opacity,
              fontSize: 108,
              fontWeight: 900,
              fontFamily: COLORS.sans,
              color: COLORS.text,
              lineHeight: 1.0,
              letterSpacing: -5,
              textShadow: `0 0 60px rgba(41,151,255,0.3)`,
            }}>
              {word}
            </div>
          ))}
        </div>

        {/* Accent underline */}
        <div style={{
          width: lineWidth,
          height: 3,
          background: `linear-gradient(90deg, transparent, ${COLORS.blue}, ${COLORS.purple}, transparent)`,
          borderRadius: 2,
          marginTop: 28,
          marginBottom: 32,
          boxShadow: `0 0 16px rgba(41,151,255,0.4)`,
        }} />

        {/* Subtitle */}
        <div style={{
          transform: `translateY(${subtitleY}px)`,
          opacity: subtitleOpacity,
          fontSize: 36,
          fontFamily: COLORS.sans,
          fontWeight: 300,
          color: COLORS.textMuted,
          textAlign: "center",
          lineHeight: 1.5,
          whiteSpace: "pre-line" as const,
        }}>
          {FEATURE.subtitle}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
