import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "./colors";
import { FEATURE } from "./config";
import { ClaudeAvatar, ClaudeCodeWordmark } from "./Logos";
import { Background } from "./Background";

type Step = typeof FEATURE.terminal.steps[number];
const SPINNER = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

const ToolCard: React.FC<{ step: Step; frame: number }> = ({ step, frame }) => {
  const { delay, duration, color, tool, input, output, isHook } = step;

  const s = spring({ frame: frame - delay, fps: 30, config: { damping: 80, stiffness: 200 } });
  const cardOpacity = interpolate(frame, [delay, delay + 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cardX = interpolate(s, [0, 1], [30, 0]);

  const isRunning = frame >= delay && frame < delay + duration;
  const isDone = frame >= delay + duration;
  const outputOpacity = interpolate(frame, [delay + duration, delay + duration + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  if (frame < delay) return null;

  return (
    <div style={{
      transform: `translateX(${cardX}px)`,
      opacity: cardOpacity,
      background: isHook ? "rgba(52,211,153,0.06)" : "rgba(255,255,255,0.04)",
      border: `1px solid ${isDone ? color + "55" : color + "22"}`,
      borderLeft: `3px solid ${color}`,
      borderRadius: 12,
      padding: "12px 16px",
      marginBottom: 10,
      fontFamily: COLORS.mono,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 16, color, minWidth: 18 }}>
          {isRunning ? SPINNER[(frame - delay) % SPINNER.length] : isDone ? "✓" : "○"}
        </span>
        <span style={{ fontSize: 17, fontWeight: "bold", color, letterSpacing: 0.5, minWidth: isHook ? undefined : 90 }}>
          {tool}
        </span>
        <span style={{ fontSize: 15, color: "rgba(240,240,248,0.45)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const, maxWidth: 320 }}>
          {input}
        </span>
      </div>
      {isDone && output && (
        <div style={{ opacity: outputOpacity, marginTop: 6, paddingLeft: 30, fontSize: 15, color: isHook ? "#34d399" : "rgba(240,240,248,0.5)" }}>
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
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Background frame={frame} />

      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          transform: `translateY(${windowY}px)`,
          opacity: windowOpacity,
          width: 960,
          background: "rgba(6,6,18,0.85)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: "0 40px 120px rgba(0,0,0,0.7), 0 0 0 1px rgba(41,151,255,0.08)",
          backdropFilter: "blur(16px)",
        }}>
          {/* Title bar */}
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "16px 22px",
            background: "rgba(255,255,255,0.03)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}>
            {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
              <div key={c} style={{ width: 14, height: 14, borderRadius: "50%", background: c }} />
            ))}
            <div style={{ marginLeft: 16 }}>
              <ClaudeCodeWordmark size={14} color="rgba(240,240,248,0.3)" showIcon={false} />
            </div>
            <span style={{ fontFamily: COLORS.mono, fontSize: 14, color: "rgba(240,240,248,0.3)" }}>
              — {FEATURE.title.toLowerCase()} demo
            </span>
            <div style={{
              marginLeft: "auto",
              display: "flex", alignItems: "center", gap: 6,
              background: "rgba(52,211,153,0.12)",
              border: "1px solid rgba(52,211,153,0.3)",
              borderRadius: 100, padding: "4px 16px",
              fontSize: 13, fontFamily: COLORS.mono, color: "#34d399",
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399" }} />
              active
            </div>
          </div>

          {/* Body */}
          <div style={{ padding: "22px 24px" }}>
            {/* User message */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                  background: "linear-gradient(135deg, #2997FF, #a78bfa)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, color: "white", fontWeight: "bold",
                }}>N</div>
                <div style={{
                  background: "rgba(41,151,255,0.12)",
                  border: "1px solid rgba(41,151,255,0.3)",
                  borderRadius: "14px 14px 14px 4px",
                  padding: "12px 18px",
                  fontFamily: COLORS.mono, fontSize: 17, color: "#f0f0f8",
                }}>
                  {msg.slice(0, charCount)}{cursor}
                </div>
              </div>
            </div>

            {/* Agent label */}
            {frame > 45 && (
              <div style={{
                display: "flex", alignItems: "center", gap: 10, marginBottom: 16,
                opacity: interpolate(frame, [45, 58], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              }}>
                <ClaudeAvatar size={30} />
                <span style={{ fontFamily: COLORS.sans, fontSize: 15, color: "rgba(240,240,248,0.4)" }}>
                  Claude is working...
                </span>
              </div>
            )}

            {/* Tool cards */}
            <div style={{ paddingLeft: 42 }}>
              {FEATURE.terminal.steps.map((step, i) => (
                <ToolCard key={i} step={step} frame={frame} />
              ))}
            </div>

            {/* Summary */}
            {frame > FEATURE.terminal.summaryFrame - 2 && (
              <div style={{
                opacity: summaryOpacity,
                marginTop: 16,
                background: "rgba(52,211,153,0.08)",
                border: "1px solid rgba(52,211,153,0.3)",
                borderRadius: 14,
                padding: "16px 20px",
              }}>
                <div style={{ fontFamily: COLORS.sans, fontSize: 18, fontWeight: 600, color: "#34d399" }}>
                  {FEATURE.terminal.summary}
                </div>
              </div>
            )}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
