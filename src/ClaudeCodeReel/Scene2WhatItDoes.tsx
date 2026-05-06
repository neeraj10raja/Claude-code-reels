import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "./colors";
import { FEATURE } from "./config";

const BULLET_COLORS = [COLORS.blue, COLORS.green, COLORS.purple, COLORS.gold];

export const Scene2WhatItDoes: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const blob1X = Math.sin(frame * 0.02) * 60;
  const blob1Y = Math.cos(frame * 0.015) * 40;

  const headerY = interpolate(spring({ frame, fps, config: { damping: 80, stiffness: 140 } }), [0, 1], [-40, 0]);
  const headerOpacity = interpolate(frame, [0, 22], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: COLORS.bg, overflow: "hidden" }}>
      {/* Animated blob */}
      <AbsoluteFill>
        <div style={{
          position: "absolute",
          width: 700, height: 700,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(41,151,255,0.12) 0%, transparent 65%)",
          left: "50%", top: "30%",
          transform: `translate(calc(-50% + ${blob1X}px), calc(-50% + ${blob1Y}px))`,
          filter: "blur(70px)",
        }} />
      </AbsoluteFill>

      {/* Dot grid */}
      <AbsoluteFill style={{ opacity: 0.08 }}>
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

      <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 56px", gap: 32 }}>
        {/* Header */}
        <div style={{ transform: `translateY(${headerY}px)`, opacity: headerOpacity }}>
          <div style={{
            fontSize: 16,
            fontFamily: COLORS.sans,
            fontWeight: 600,
            letterSpacing: 5,
            textTransform: "uppercase" as const,
            color: COLORS.blue,
            marginBottom: 12,
          }}>
            What it does
          </div>
          <div style={{
            fontSize: 62,
            fontWeight: 900,
            fontFamily: COLORS.sans,
            color: COLORS.text,
            letterSpacing: -3,
            lineHeight: 1.05,
          }}>
            {FEATURE.title}
          </div>
        </div>

        {/* Bullet cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {FEATURE.bullets.map((bullet, i) => {
            const delay = 35 + i * 30;
            const s = spring({ frame: frame - delay, fps, config: { damping: 80, stiffness: 150 } });
            const x = interpolate(s, [0, 1], [-50, 0]);
            const opacity = interpolate(frame, [delay, delay + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const pulse = 0.4 + Math.sin((frame + i * 22) * 0.06) * 0.3;
            const color = BULLET_COLORS[i % BULLET_COLORS.length];

            return (
              <div key={i} style={{
                transform: `translateX(${x}px)`,
                opacity,
                display: "flex",
                alignItems: "center",
                gap: 22,
                background: `linear-gradient(135deg, ${COLORS.bgCard} 0%, rgba(15,15,28,0.6) 100%)`,
                border: `1px solid ${color}22`,
                borderLeft: `4px solid ${color}`,
                borderRadius: 20,
                padding: "26px 30px",
                backdropFilter: "blur(8px)",
              }}>
                {/* Icon */}
                <div style={{
                  position: "relative",
                  width: 58,
                  height: 58,
                  borderRadius: 16,
                  background: `${color}14`,
                  border: `1px solid ${color}33`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 26,
                  flexShrink: 0,
                }}>
                  {bullet.icon}
                  <div style={{
                    position: "absolute",
                    top: -3, right: -3,
                    width: 9, height: 9,
                    borderRadius: "50%",
                    background: color,
                    opacity: pulse,
                    boxShadow: `0 0 10px ${color}`,
                  }} />
                </div>

                {/* Text */}
                <div>
                  <div style={{
                    fontSize: 28,
                    fontFamily: COLORS.sans,
                    fontWeight: 600,
                    color: COLORS.text,
                    lineHeight: 1.3,
                  }}>
                    {bullet.text}
                  </div>
                </div>

                {/* Arrow indicator */}
                <div style={{
                  marginLeft: "auto",
                  fontSize: 20,
                  color: color,
                  opacity: 0.5,
                  flexShrink: 0,
                }}>
                  →
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
