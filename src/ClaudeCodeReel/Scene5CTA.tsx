import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "./colors";
import { FEATURE } from "./config";
import { ClaudeCodeWordmark, AnthropicBadge } from "./Logos";

export const Scene5CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const orbScale = 1 + Math.sin(frame * 0.05) * 0.07;

  const labelOpacity = interpolate(frame, [5, 25], [0, 1], { extrapolateRight: "clamp" });

  const titleScale = spring({ frame: frame - 20, fps, config: { damping: 70, stiffness: 180 } });
  const titleOpacity = interpolate(frame, [20, 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const lineWidth = interpolate(spring({ frame: frame - 50, fps, config: { damping: 100 } }), [0, 1], [0, 400]);

  const taglineY = interpolate(spring({ frame: frame - 65, fps, config: { damping: 100 } }), [0, 1], [30, 0]);
  const taglineOpacity = interpolate(frame, [65, 85], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const badgeOpacity = interpolate(frame, [90, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const logoScale = spring({ frame: frame - 5, fps, config: { damping: 70, stiffness: 160 } });
  const logoOpacity = interpolate(frame, [5, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const attributionOpacity = interpolate(frame, [120, 145], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: COLORS.bg, overflow: "hidden" }}>
      {/* Grid */}
      <AbsoluteFill style={{ opacity: 0.05 }}>
        <svg width="1080" height="1920">
          {Array.from({ length: 12 }, (_, i) => (
            <line key={`v${i}`} x1={i * 98} y1="0" x2={i * 98} y2="1920" stroke={COLORS.blue} strokeWidth="1" />
          ))}
          {Array.from({ length: 22 }, (_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 90} x2="1080" y2={i * 90} stroke={COLORS.blue} strokeWidth="1" />
          ))}
        </svg>
      </AbsoluteFill>

      {/* Glowing orb */}
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(41,151,255,0.18) 0%, rgba(167,139,250,0.08) 50%, transparent 70%)",
          transform: `scale(${orbScale})`,
        }} />
      </AbsoluteFill>

      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 60px" }}>
        {/* Claude Code logo — prominent, animated in */}
        <div style={{
          transform: `scale(${interpolate(logoScale, [0, 1], [0.7, 1])})`,
          opacity: logoOpacity,
          marginBottom: 48,
        }}>
          <ClaudeCodeWordmark size={30} color={COLORS.blue} showIcon />
        </div>

        {/* "Follow for more" label */}
        <div style={{ opacity: labelOpacity, fontSize: 20, fontFamily: COLORS.mono, letterSpacing: 5, textTransform: "uppercase" as const, color: COLORS.textDim, marginBottom: 28 }}>
          {FEATURE.cta.followText}
        </div>

        {/* Handle */}
        <div style={{
          transform: `scale(${titleScale})`,
          opacity: titleOpacity,
          fontSize: 78,
          fontWeight: 800,
          fontFamily: COLORS.sans,
          color: COLORS.text,
          letterSpacing: -2,
          textAlign: "center",
          textShadow: "0 0 60px rgba(41,151,255,0.35)",
        }}>
          {FEATURE.cta.handle}
        </div>

        {/* Divider */}
        <div style={{
          width: lineWidth,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${COLORS.blue}, ${COLORS.purple}, transparent)`,
          marginTop: 32,
          marginBottom: 32,
        }} />

        {/* Tagline */}
        <div style={{
          transform: `translateY(${taglineY}px)`,
          opacity: taglineOpacity,
          fontSize: 34,
          fontFamily: COLORS.sans,
          fontWeight: 300,
          color: COLORS.textMuted,
          textAlign: "center",
          lineHeight: 1.4,
        }}>
          {FEATURE.cta.tagline}
        </div>

        {/* Badge */}
        <div style={{
          opacity: badgeOpacity,
          marginTop: 56,
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: COLORS.blueDim,
          border: `1px solid ${COLORS.borderBright}`,
          borderRadius: 100,
          padding: "14px 32px",
        }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.blue }} />
          <span style={{ fontFamily: COLORS.mono, fontSize: 20, color: COLORS.blue, letterSpacing: 2 }}>
            Claude Code · Daily Tips
          </span>
        </div>

        {/* Anthropic attribution — fades in last */}
        <div style={{ marginTop: 40 }}>
          <AnthropicBadge opacity={attributionOpacity} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
