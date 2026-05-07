import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "./colors";
import { FEATURE } from "./config";
import { Background, gradientText } from "./Background";

const Counter: React.FC<{ value: string; frame: number; startFrame: number }> = ({ value, frame, startFrame }) => {
  const num = Number(value);
  if (isNaN(num)) return <>{value}</>;
  const progress = interpolate(frame, [startFrame, startFrame + 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const eased = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
  return <>{Math.round(num * eased)}</>;
};

export const Scene4Impact: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleY = interpolate(spring({ frame, fps, config: { damping: 80 } }), [0, 1], [-30, 0]);
  const titleOpacity = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: "clamp" });

  const beforeY = interpolate(spring({ frame: frame - 30, fps, config: { damping: 80, stiffness: 140 } }), [0, 1], [50, 0]);
  const beforeOpacity = interpolate(frame, [30, 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const arrowOpacity = interpolate(frame, [60, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const afterY = interpolate(spring({ frame: frame - 70, fps, config: { damping: 80, stiffness: 140 } }), [0, 1], [50, 0]);
  const afterOpacity = interpolate(frame, [70, 95], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const metricScale = spring({ frame: frame - 100, fps, config: { damping: 60, stiffness: 200 } });
  const metricOpacity = interpolate(frame, [100, 125], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const labelOpacity = interpolate(frame, [130, 150], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const cardBase: React.CSSProperties = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 24,
    padding: "38px 44px",
    width: "100%",
    textAlign: "center",
    backdropFilter: "blur(12px)",
  };

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Background frame={frame} />

      <AbsoluteFill style={{
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "0 60px", gap: 32,
      }}>
        {/* Title */}
        <div style={{ transform: `translateY(${titleY}px)`, opacity: titleOpacity, textAlign: "center" }}>
          <div style={{ fontSize: 22, fontFamily: COLORS.mono, letterSpacing: 5, textTransform: "uppercase" as const, color: "rgba(255,255,255,0.35)", marginBottom: 14 }}>
            The result
          </div>
          <div style={{ fontSize: 72, fontWeight: 900, fontFamily: COLORS.sans, letterSpacing: -2, ...gradientText }}>
            Before & After
          </div>
        </div>

        {/* Before card */}
        <div style={{
          transform: `translateY(${beforeY}px)`,
          opacity: beforeOpacity,
          ...cardBase,
          borderTop: "4px solid #f87171",
        }}>
          <div style={{ fontSize: 18, fontFamily: COLORS.mono, letterSpacing: 4, textTransform: "uppercase" as const, color: "#f87171", marginBottom: 14 }}>
            Before
          </div>
          <div style={{ fontSize: 76, fontWeight: 900, fontFamily: COLORS.sans, color: "#f87171", letterSpacing: -2, lineHeight: 1 }}>
            {FEATURE.impact.before.value}
          </div>
          <div style={{ fontSize: 24, fontFamily: COLORS.sans, color: "rgba(255,255,255,0.45)", marginTop: 14, lineHeight: 1.4 }}>
            {FEATURE.impact.before.detail}
          </div>
        </div>

        {/* Arrow */}
        <div style={{ opacity: arrowOpacity, fontSize: 54, color: "#2997FF", filter: "drop-shadow(0 0 12px #2997FF)" }}>
          ↓
        </div>

        {/* After card */}
        <div style={{
          transform: `translateY(${afterY}px)`,
          opacity: afterOpacity,
          ...cardBase,
          borderTop: "4px solid #34d399",
        }}>
          <div style={{ fontSize: 18, fontFamily: COLORS.mono, letterSpacing: 4, textTransform: "uppercase" as const, color: "#34d399", marginBottom: 14 }}>
            After
          </div>
          <div style={{ fontSize: 76, fontWeight: 900, fontFamily: COLORS.sans, color: "#34d399", letterSpacing: -2, lineHeight: 1 }}>
            {FEATURE.impact.after.value}
          </div>
          <div style={{ fontSize: 24, fontFamily: COLORS.sans, color: "rgba(255,255,255,0.45)", marginTop: 14, lineHeight: 1.4 }}>
            {FEATURE.impact.after.detail}
          </div>
        </div>

        {/* Metric counter */}
        <div style={{
          transform: `scale(${metricScale})`,
          opacity: metricOpacity,
          background: "linear-gradient(135deg, rgba(41,151,255,0.14), rgba(52,211,153,0.1))",
          border: "1px solid rgba(41,151,255,0.3)",
          borderRadius: 24, padding: "30px 60px",
          textAlign: "center", width: "100%",
        }}>
          <div style={{
            fontSize: 90, fontWeight: 900, fontFamily: COLORS.sans,
            letterSpacing: -3, ...gradientText,
          }}>
            <Counter value={FEATURE.impact.metric} frame={frame} startFrame={105} />
            <span style={{ fontSize: 38, fontWeight: 400 }}>
              {FEATURE.impact.metricSuffix}
            </span>
          </div>
          <div style={{ opacity: labelOpacity, fontSize: 20, fontFamily: COLORS.mono, color: "rgba(255,255,255,0.4)", marginTop: 10 }}>
            {FEATURE.impact.metricLabel}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
