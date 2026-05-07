import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "./colors";
import { FEATURE } from "./config";
import { Background, gradientText, glassCard } from "./Background";

const BULLET_COLORS = ["#2997FF", "#34d399", "#a78bfa", "#fbbf24"];

export const Scene2WhatItDoes: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerY = interpolate(spring({ frame, fps, config: { damping: 80, stiffness: 140 } }), [0, 1], [-40, 0]);
  const headerOpacity = interpolate(frame, [0, 22], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Background frame={frame} />

      <AbsoluteFill style={{
        display: "flex", flexDirection: "column",
        justifyContent: "center", padding: "0 56px", gap: 32,
      }}>
        {/* Header */}
        <div style={{ transform: `translateY(${headerY}px)`, opacity: headerOpacity }}>
          <div style={{
            fontSize: 22, fontFamily: COLORS.sans, fontWeight: 600,
            letterSpacing: 5, textTransform: "uppercase" as const,
            color: "#2997FF", marginBottom: 14,
          }}>
            What it does
          </div>
          <div style={{
            fontSize: 72, fontWeight: 900, fontFamily: COLORS.sans,
            letterSpacing: -3, lineHeight: 1.0, ...gradientText,
          }}>
            {FEATURE.title}
          </div>
        </div>

        {/* Bullet cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {FEATURE.bullets.map((bullet, i) => {
            const delay = 35 + i * 32;
            const s = spring({ frame: frame - delay, fps, config: { damping: 80, stiffness: 150 } });
            const x = interpolate(s, [0, 1], [-60, 0]);
            const opacity = interpolate(frame, [delay, delay + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const color = BULLET_COLORS[i % BULLET_COLORS.length];
            const pulse = 0.5 + Math.sin((frame + i * 22) * 0.06) * 0.25;

            return (
              <div key={i} style={{
                transform: `translateX(${x}px)`,
                opacity,
                ...glassCard,
                borderLeft: `4px solid ${color}`,
                padding: "28px 30px",
                display: "flex", alignItems: "center", gap: 24,
              }}>
                {/* Icon bubble */}
                <div style={{
                  position: "relative",
                  width: 64, height: 64, borderRadius: 18, flexShrink: 0,
                  background: `${color}18`,
                  border: `1px solid ${color}40`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 28,
                }}>
                  {bullet.icon}
                  <div style={{
                    position: "absolute", top: -4, right: -4,
                    width: 10, height: 10, borderRadius: "50%",
                    background: color, opacity: pulse,
                    boxShadow: `0 0 10px ${color}`,
                  }} />
                </div>

                {/* Text */}
                <div style={{
                  fontSize: 30, fontFamily: COLORS.sans, fontWeight: 600,
                  color: "#f0f0f8", lineHeight: 1.3, flex: 1,
                }}>
                  {bullet.text}
                </div>

                {/* Arrow */}
                <div style={{ fontSize: 22, color, opacity: 0.55, flexShrink: 0 }}>→</div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
