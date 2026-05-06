import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "./colors";
import { FEATURE } from "./config";

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

  return (
    <AbsoluteFill style={{ background: COLORS.bg, overflow: "hidden" }}>
      {/* Grid */}
      <AbsoluteFill style={{ opacity: 0.04 }}>
        <svg width="1080" height="1920">
          {Array.from({ length: 12 }, (_, i) => (
            <line key={`v${i}`} x1={i * 98} y1="0" x2={i * 98} y2="1920" stroke={COLORS.blue} strokeWidth="1" />
          ))}
          {Array.from({ length: 22 }, (_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 90} x2="1080" y2={i * 90} stroke={COLORS.blue} strokeWidth="1" />
          ))}
        </svg>
      </AbsoluteFill>

      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 60px", gap: 36 }}>
        {/* Title */}
        <div style={{ transform: `translateY(${titleY}px)`, opacity: titleOpacity, textAlign: "center" }}>
          <div style={{ fontSize: 20, fontFamily: COLORS.mono, letterSpacing: 5, textTransform: "uppercase" as const, color: COLORS.textDim, marginBottom: 12 }}>
            The result
          </div>
          <div style={{ fontSize: 64, fontWeight: 800, fontFamily: COLORS.sans, color: COLORS.text, letterSpacing: -2 }}>
            Before <span style={{ color: COLORS.blue }}>&amp;</span> After
          </div>
        </div>

        {/* Before */}
        <div style={{
          transform: `translateY(${beforeY}px)`,
          opacity: beforeOpacity,
          background: COLORS.bgCard,
          border: `1px solid ${COLORS.red}44`,
          borderTop: `4px solid ${COLORS.red}`,
          borderRadius: 20,
          padding: "36px 40px",
          width: "100%",
          textAlign: "center",
        }}>
          <div style={{ fontSize: 16, fontFamily: COLORS.mono, letterSpacing: 4, textTransform: "uppercase" as const, color: COLORS.red, marginBottom: 12 }}>
            Before
          </div>
          <div style={{ fontSize: 72, fontWeight: 800, fontFamily: COLORS.sans, color: COLORS.red, letterSpacing: -2, lineHeight: 1 }}>
            {FEATURE.impact.before.value}
          </div>
          <div style={{ fontSize: 22, fontFamily: COLORS.sans, color: COLORS.textMuted, marginTop: 12, lineHeight: 1.4 }}>
            {FEATURE.impact.before.detail}
          </div>
        </div>

        {/* Arrow */}
        <div style={{ opacity: arrowOpacity, fontSize: 52, color: COLORS.blue, filter: `drop-shadow(0 0 12px ${COLORS.blue})` }}>
          ↓
        </div>

        {/* After */}
        <div style={{
          transform: `translateY(${afterY}px)`,
          opacity: afterOpacity,
          background: COLORS.bgCard,
          border: `1px solid ${COLORS.green}44`,
          borderTop: `4px solid ${COLORS.green}`,
          borderRadius: 20,
          padding: "36px 40px",
          width: "100%",
          textAlign: "center",
        }}>
          <div style={{ fontSize: 16, fontFamily: COLORS.mono, letterSpacing: 4, textTransform: "uppercase" as const, color: COLORS.green, marginBottom: 12 }}>
            After
          </div>
          <div style={{ fontSize: 72, fontWeight: 800, fontFamily: COLORS.sans, color: COLORS.green, letterSpacing: -2, lineHeight: 1 }}>
            {FEATURE.impact.after.value}
          </div>
          <div style={{ fontSize: 22, fontFamily: COLORS.sans, color: COLORS.textMuted, marginTop: 12, lineHeight: 1.4 }}>
            {FEATURE.impact.after.detail}
          </div>
        </div>

        {/* Metric counter */}
        <div style={{
          transform: `scale(${metricScale})`,
          opacity: metricOpacity,
          background: `linear-gradient(135deg, ${COLORS.blueDim}, ${COLORS.purpleDim})`,
          border: `1px solid ${COLORS.borderBright}`,
          borderRadius: 20,
          padding: "28px 60px",
          textAlign: "center",
          width: "100%",
        }}>
          <div style={{ fontSize: 86, fontWeight: 900, fontFamily: COLORS.sans, color: COLORS.text, letterSpacing: -3, textShadow: `0 0 40px ${COLORS.blue}` }}>
            <Counter value={FEATURE.impact.metric} frame={frame} startFrame={105} />
            <span style={{ fontSize: 36, color: COLORS.textMuted, fontWeight: 400 }}>
              {FEATURE.impact.metricSuffix}
            </span>
          </div>
          <div style={{ opacity: labelOpacity, fontSize: 18, fontFamily: COLORS.mono, color: COLORS.textMuted, marginTop: 8 }}>
            {FEATURE.impact.metricLabel}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
