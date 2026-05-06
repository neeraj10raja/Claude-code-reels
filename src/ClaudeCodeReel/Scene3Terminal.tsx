import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "./colors";
import { FEATURE } from "./config";
import { ClaudeAvatar, ClaudeCodeWordmark } from "./Logos";

type Step = typeof FEATURE.terminal.steps[number];

const SPINNER = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

const ToolCard: React.FC<{ step: Step; frame: number }> = ({ step, frame }) => {
  const { delay, duration, color, tool, input, output, isHook } = step;

  const cardSpring = spring({ frame: frame - delay, fps: 30, config: { damping: 80, stiffness: 200 } });
  const cardOpacity = interpolate(frame, [delay, delay + 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cardX = interpolate(cardSpring, [0, 1], [30, 0]);

  const isRunning = frame >= delay && frame < delay + duration;
  const isDone = frame >= delay + duration;
  const outputOpacity = interpolate(frame, [delay + duration, delay + duration + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  if (frame < delay) return null;

  return (
    <div style={{
      transform: `translateX(${cardX}px)`,
      opacity: cardOpacity,
      background: isHook ? `${COLORS.green}08` : COLORS.bgCard,
      border: `1px solid ${isDone ? color + "55" : color + "22"}`,
      borderLeft: `3px solid ${color}`,
      borderRadius: 8,
      padding: "10px 14px",
      marginBottom: 8,
      fontFamily: COLORS.mono,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 14, color, minWidth: 16 }}>
          {isRunning ? SPINNER[(frame - delay) % SPINNER.length] : isDone ? "✓" : "○"}
        </span>
        <span style={{ fontSize: 15, fontWeight: "bold", color, letterSpacing: 0.5, minWidth: isHook ? undefined : 80 }}>
          {tool}
        </span>
        <span style={{ fontSize: 13, color: COLORS.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const, maxWidth: 300 }}>
          {input}
        </span>
      </div>
      {isDone && output && (
        <div style={{ opacity: outputOpacity, marginTop: 5, paddingLeft: 26, fontSize: 13, color: isHook ? COLORS.green : COLORS.textMuted }}>
          {output}
        </div>
      )}
    </div>
  );
};

export const Scene3Terminal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const windowY = interpolate(spring({ frame, fps, config: { damping: 80, stiffness: 140 } }), [0, 1], [60, 0]);
  const windowOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  const msg = FEATURE.terminal.userMessage;
  const charCount = Math.floor(interpolate(frame, [15, 42], [0, msg.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const cursor = frame < 42 && frame % 20 < 12 ? "█" : "";

  const summaryOpacity = interpolate(
    frame,
    [FEATURE.terminal.summaryFrame, FEATURE.terminal.summaryFrame + 20],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ background: COLORS.bg, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* Grid */}
      <AbsoluteFill style={{ opacity: 0.03 }}>
        <svg width="1080" height="1920">
          {Array.from({ length: 12 }, (_, i) => (
            <line key={`v${i}`} x1={i * 98} y1="0" x2={i * 98} y2="1920" stroke={COLORS.blue} strokeWidth="1" />
          ))}
          {Array.from({ length: 22 }, (_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 90} x2="1080" y2={i * 90} stroke={COLORS.blue} strokeWidth="1" />
          ))}
        </svg>
      </AbsoluteFill>

      <div style={{
        transform: `translateY(${windowY}px)`,
        opacity: windowOpacity,
        width: 960,
        background: "#0d0d14",
        border: `1px solid ${COLORS.border}`,
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 40px 120px rgba(0,0,0,0.7), 0 0 0 1px rgba(100,120,255,0.1)",
      }}>
        {/* Title bar */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "14px 20px",
          background: "#111118",
          borderBottom: `1px solid ${COLORS.border}`,
        }}>
          <div style={{ width: 13, height: 13, borderRadius: "50%", background: "#ff5f57" }} />
          <div style={{ width: 13, height: 13, borderRadius: "50%", background: "#febc2e" }} />
          <div style={{ width: 13, height: 13, borderRadius: "50%", background: "#28c840" }} />
          <div style={{ marginLeft: 16 }}>
            <ClaudeCodeWordmark size={14} color={COLORS.textDim} showIcon={false} />
          </div>
          <span style={{ fontFamily: COLORS.mono, fontSize: 13, color: COLORS.textDim }}>
            — {FEATURE.title.toLowerCase()} demo
          </span>
          <div style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: `${COLORS.green}18`,
            border: `1px solid ${COLORS.green}33`,
            borderRadius: 100,
            padding: "3px 14px",
            fontSize: 13,
            fontFamily: COLORS.mono,
            color: COLORS.green,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.green }} />
            hooks active
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 22px" }}>
          {/* User message */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div style={{
                width: 30, height: 30, borderRadius: "50%",
                background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.purple})`,
                flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, color: "white", fontWeight: "bold",
              }}>N</div>
              <div style={{
                background: `${COLORS.blue}18`,
                border: `1px solid ${COLORS.blue}33`,
                borderRadius: "12px 12px 12px 4px",
                padding: "10px 16px",
                fontFamily: COLORS.mono,
                fontSize: 16,
                color: COLORS.text,
              }}>
                {msg.slice(0, charCount)}{cursor}
              </div>
            </div>
          </div>

          {/* Agent label */}
          {frame > 45 && (
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 14,
              opacity: interpolate(frame, [45, 58], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            }}>
              <ClaudeAvatar size={30} />
              <span style={{ fontFamily: COLORS.sans, fontSize: 14, color: COLORS.textDim }}>Claude is working...</span>
            </div>
          )}

          {/* Tool cards */}
          <div style={{ paddingLeft: 38 }}>
            {FEATURE.terminal.steps.map((step, i) => (
              <ToolCard key={i} step={step} frame={frame} />
            ))}
          </div>

          {/* Summary */}
          {frame > FEATURE.terminal.summaryFrame - 2 && (
            <div style={{
              opacity: summaryOpacity,
              marginTop: 14,
              background: `${COLORS.green}10`,
              border: `1px solid ${COLORS.green}30`,
              borderRadius: 10,
              padding: "14px 18px",
            }}>
              <div style={{ fontFamily: COLORS.sans, fontSize: 17, fontWeight: 600, color: COLORS.green }}>
                {FEATURE.terminal.summary}
              </div>
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
