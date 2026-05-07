import React from "react";
import { AbsoluteFill } from "remotion";

export const Background: React.FC<{ frame?: number }> = ({ frame = 0 }) => {
  const b1x = Math.sin(frame * 0.016) * 60;
  const b1y = Math.cos(frame * 0.012) * 50;
  const b2x = Math.cos(frame * 0.019) * 50;
  const b2y = Math.sin(frame * 0.014) * 40;

  return (
    <AbsoluteFill style={{ background: "#060612", overflow: "hidden" }}>
      {/* Radial gradient blobs */}
      <AbsoluteFill>
        <svg width="1080" height="1920" viewBox="0 0 1080 1920">
          <defs>
            <radialGradient id="bg1" cx="20%" cy="20%" r="60%">
              <stop offset="0%" stopColor="#1a1a6e" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#000" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="bg2" cx="80%" cy="78%" r="55%">
              <stop offset="0%" stopColor="#0d4f3c" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#000" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="bg3" cx="50%" cy="45%" r="40%">
              <stop offset="0%" stopColor="#2997FF" stopOpacity="0.09" />
              <stop offset="100%" stopColor="#000" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="1080" height="1920" fill="url(#bg1)"
            transform={`translate(${b1x},${b1y})`} />
          <rect width="1080" height="1920" fill="url(#bg2)"
            transform={`translate(${b2x},${b2y})`} />
          <rect width="1080" height="1920" fill="url(#bg3)" />
        </svg>
      </AbsoluteFill>

      {/* Line grid */}
      <AbsoluteFill>
        <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{ opacity: 0.04 }}>
          {Array.from({ length: 18 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 64} y1="0" x2={i * 64} y2="1920" stroke="#fff" strokeWidth="1" />
          ))}
          {Array.from({ length: 31 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 64} x2="1080" y2={i * 64} stroke="#fff" strokeWidth="1" />
          ))}
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const gradientText: React.CSSProperties = {
  background: "linear-gradient(135deg, #fff 0%, #a0c4ff 50%, #34d399 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

export const glassCard: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 24,
  backdropFilter: "blur(12px)",
};

export const pillBadge: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 10,
  background: "rgba(41,151,255,0.12)",
  border: "1px solid rgba(41,151,255,0.35)",
  borderRadius: 50,
  padding: "12px 28px",
};
