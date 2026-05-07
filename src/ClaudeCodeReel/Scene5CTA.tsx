import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "./colors";
import { FEATURE } from "./config";
import { AnthropicBadge } from "./Logos";
import { Background, gradientText } from "./Background";

export const Scene5CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const followOpacity = interpolate(frame, [5, 28], [0, 1], { extrapolateRight: "clamp" });

  const handleScale = spring({ frame: frame - 20, fps, config: { damping: 70, stiffness: 180 } });
  const handleOpacity = interpolate(frame, [20, 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const lineWidth = interpolate(spring({ frame: frame - 55, fps, config: { damping: 100 } }), [0, 1], [0, 420]);

  const taglineY = interpolate(spring({ frame: frame - 68, fps, config: { damping: 100 } }), [0, 1], [30, 0]);
  const taglineOpacity = interpolate(frame, [68, 88], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const githubOpacity = interpolate(frame, [95, 115], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const attributionOpacity = interpolate(frame, [120, 145], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Pulsing glow behind button
  const glowPulse = 0.6 + Math.sin(frame * 0.08) * 0.2;

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Background frame={frame} />

      <AbsoluteFill style={{
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", padding: "0 60px",
      }}>
        {/* Follow label */}
        <div style={{
          opacity: followOpacity,
          fontFamily: COLORS.mono, fontSize: 22, letterSpacing: 5,
          textTransform: "uppercase" as const, color: "rgba(255,255,255,0.35)",
          marginBottom: 36,
        }}>
          {FEATURE.cta.followText}
        </div>

        {/* Handle — gradient pill button */}
        <div style={{
          transform: `scale(${interpolate(handleScale, [0, 1], [0.8, 1])})`,
          opacity: handleOpacity,
          marginBottom: 40,
          position: "relative",
        }}>
          {/* Glow */}
          <div style={{
            position: "absolute", inset: -20, borderRadius: 70,
            background: "linear-gradient(135deg, rgba(41,151,255,0.3), rgba(52,211,153,0.2))",
            filter: "blur(24px)", opacity: glowPulse,
          }} />
          <div style={{
            position: "relative",
            background: "linear-gradient(135deg, #2997FF, #34d399)",
            borderRadius: 60, padding: "28px 80px",
          }}>
            <span style={{
              fontFamily: COLORS.sans, fontSize: 52, fontWeight: 800,
              color: "#fff", letterSpacing: -1,
            }}>
              {FEATURE.cta.handle}
            </span>
          </div>
        </div>

        {/* Gradient divider */}
        <div style={{
          width: lineWidth, height: 2, marginBottom: 36,
          background: "linear-gradient(90deg, transparent, #2997FF, #34d399, transparent)",
          borderRadius: 2,
        }} />

        {/* Tagline */}
        <div style={{
          transform: `translateY(${taglineY}px)`,
          opacity: taglineOpacity,
          fontFamily: COLORS.sans, fontSize: 32, fontWeight: 400,
          color: "rgba(255,255,255,0.5)", textAlign: "center", lineHeight: 1.5,
          marginBottom: 48,
        }}>
          {FEATURE.cta.tagline}
        </div>

        {/* GitHub link */}
        <div style={{
          opacity: githubOpacity,
          fontFamily: COLORS.mono, fontSize: 22,
          color: "rgba(255,255,255,0.25)", marginBottom: 48,
          ...gradientText,
        }}>
          github.com/neeraj10raja/Claude-code-reels
        </div>

        {/* Anthropic badge */}
        <div style={{ marginTop: 8 }}>
          <AnthropicBadge opacity={attributionOpacity} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
