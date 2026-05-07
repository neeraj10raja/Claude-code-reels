import React from "react";
import { AbsoluteFill } from "remotion";

const TERMINAL_LINES = [
  { prompt: "$", cmd: "python3 scripts/setup.py", color: "#64d2ff" },
  { prompt: "→", cmd: 'Topic: "productivity tips"', color: "#34d399" },
  { prompt: "✓", cmd: "Voice cloned · voice.m4a", color: "#a78bfa" },
  { prompt: "✓", cmd: "Rendered · reel.mp4  7 MB", color: "#34d399" },
];

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: "#000", fontFamily: "Inter, sans-serif", overflow: "hidden" }}>

    {/* Gradient mesh background */}
    <AbsoluteFill>
      <svg width="1080" height="1920" viewBox="0 0 1080 1920">
        <defs>
          <radialGradient id="g1" cx="20%" cy="20%" r="60%">
            <stop offset="0%" stopColor="#1a1a6e" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="g2" cx="80%" cy="75%" r="55%">
            <stop offset="0%" stopColor="#0d4f3c" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="g3" cx="50%" cy="45%" r="40%">
            <stop offset="0%" stopColor="#2997FF" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="1080" height="1920" fill="#060612" />
        <rect width="1080" height="1920" fill="url(#g1)" />
        <rect width="1080" height="1920" fill="url(#g2)" />
        <rect width="1080" height="1920" fill="url(#g3)" />
      </svg>
    </AbsoluteFill>

    {/* Grid lines */}
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

    {/* Top badge */}
    <div style={{
      position: "absolute", top: 90, left: 0, right: 0,
      display: "flex", justifyContent: "center",
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        background: "rgba(41,151,255,0.12)",
        border: "1px solid rgba(41,151,255,0.35)",
        borderRadius: 50, padding: "14px 32px",
      }}>
        <div style={{
          width: 10, height: 10, borderRadius: "50%",
          background: "#34d399", boxShadow: "0 0 8px #34d399",
        }} />
        <span style={{ color: "#64d2ff", fontSize: 28, fontWeight: 600, letterSpacing: 3 }}>
          OPEN SOURCE
        </span>
      </div>
    </div>

    {/* Main headline */}
    <div style={{
      position: "absolute", top: 260, left: 0, right: 0,
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "0 60px",
    }}>
      {/* Eyebrow */}
      <div style={{ color: "#2997FF", fontSize: 32, fontWeight: 500, letterSpacing: 6, marginBottom: 24 }}>
        CLAUDE CODE
      </div>

      {/* Big title */}
      <div style={{
        fontSize: 148, fontWeight: 900, lineHeight: 0.95,
        textAlign: "center", letterSpacing: -4,
        background: "linear-gradient(135deg, #fff 0%, #a0c4ff 50%, #34d399 100%)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
      }}>
        Auto<br />Reels
      </div>

      {/* Subtitle */}
      <div style={{
        marginTop: 40, fontSize: 36, fontWeight: 400,
        color: "rgba(255,255,255,0.55)", textAlign: "center", lineHeight: 1.5,
      }}>
        Turn any topic into a professional{"\n"}Instagram Reel — automatically
      </div>
    </div>

    {/* Terminal card */}
    <div style={{
      position: "absolute", top: 860, left: 60, right: 60,
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 24, padding: "40px 44px",
      backdropFilter: "blur(12px)",
    }}>
      {/* Terminal header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
        {["#FF5F57", "#FFBD2E", "#28CA41"].map((c) => (
          <div key={c} style={{ width: 18, height: 18, borderRadius: "50%", background: c }} />
        ))}
        <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 24, marginLeft: 12, fontFamily: "monospace" }}>
          terminal
        </span>
      </div>

      {/* Terminal lines */}
      {TERMINAL_LINES.map((line, i) => (
        <div key={i} style={{
          display: "flex", gap: 20, marginBottom: 22,
          fontFamily: "'Menlo', 'Monaco', monospace", fontSize: 28,
        }}>
          <span style={{ color: line.color, minWidth: 32 }}>{line.prompt}</span>
          <span style={{ color: i === 0 ? "#fff" : "rgba(255,255,255,0.7)" }}>{line.cmd}</span>
        </div>
      ))}
    </div>

    {/* Stats row */}
    <div style={{
      position: "absolute", top: 1270, left: 60, right: 60,
      display: "flex", gap: 24,
    }}>
      {[
        { value: "5 min", label: "first render" },
        { value: "free", label: "no API key" },
        { value: "33s", label: "reel length" },
      ].map(({ value, label }) => (
        <div key={label} style={{
          flex: 1, textAlign: "center",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 20, padding: "36px 20px",
        }}>
          <div style={{ fontSize: 52, fontWeight: 800, color: "#fff", lineHeight: 1 }}>{value}</div>
          <div style={{ fontSize: 24, color: "rgba(255,255,255,0.4)", marginTop: 10 }}>{label}</div>
        </div>
      ))}
    </div>

    {/* Bottom CTA */}
    <div style={{
      position: "absolute", bottom: 100, left: 0, right: 0,
      display: "flex", flexDirection: "column", alignItems: "center", gap: 20,
    }}>
      <div style={{
        background: "linear-gradient(135deg, #2997FF, #34d399)",
        borderRadius: 60, padding: "28px 80px",
      }}>
        <span style={{ color: "#fff", fontSize: 36, fontWeight: 700 }}>
          @claudecodereels
        </span>
      </div>
      <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 26 }}>
        github.com/neeraj10raja/Claude-code-reels
      </div>
    </div>

  </AbsoluteFill>
);
