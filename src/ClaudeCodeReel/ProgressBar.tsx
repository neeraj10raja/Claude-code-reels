import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "./colors";

export const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const progress = frame / durationInFrames;

  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 100 }}>
      {/* Track */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        height: 4,
        background: "rgba(255,255,255,0.08)",
      }} />
      {/* Fill */}
      <div style={{
        position: "absolute",
        top: 0, left: 0,
        height: 4,
        width: `${progress * 100}%`,
        background: `linear-gradient(90deg, ${COLORS.blue}, ${COLORS.purple})`,
        boxShadow: `0 0 12px ${COLORS.blue}`,
        borderRadius: "0 2px 2px 0",
      }} />
    </AbsoluteFill>
  );
};
