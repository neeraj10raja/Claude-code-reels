import React from "react";
import { COLORS } from "./colors";

// Anthropic "A" mark — simplified geometric version
export const AnthropicMark: React.FC<{ size?: number; color?: string }> = ({
  size = 32,
  color = COLORS.text,
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <path
      d="M50 8L88 84H64.5L50 52.5L35.5 84H12L50 8Z"
      fill={color}
    />
    <path
      d="M35 62H65L57 44H43L35 62Z"
      fill={COLORS.bg}
    />
  </svg>
);

// Claude Code wordmark — terminal caret + "Claude Code"
export const ClaudeCodeWordmark: React.FC<{
  size?: number;
  color?: string;
  showIcon?: boolean;
}> = ({ size = 22, color = COLORS.blue, showIcon = true }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    {showIcon && (
      <div style={{
        width: size * 1.8, height: size * 1.8,
        borderRadius: size * 0.4,
        background: `${color}18`,
        border: `1.5px solid ${color}55`,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path d="M4 8L8 12L4 16" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M11 16H19" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>
    )}
    <span style={{
      fontFamily: COLORS.sans,
      fontSize: size,
      fontWeight: 700,
      color,
      letterSpacing: -0.5,
    }}>
      Claude Code
    </span>
  </div>
);

// Claude avatar icon (for terminal agent bubble)
export const ClaudeAvatar: React.FC<{ size?: number }> = ({ size = 34 }) => (
  <div style={{
    width: size, height: size,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #7C3AED 0%, #2997FF 100%)",
    flexShrink: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 0 16px rgba(41,151,255,0.4)",
  }}>
    <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none">
      <path d="M12 4L19 18H5L12 4Z" fill="white" opacity={0.9} />
      <path d="M9 14H15L13 10H11L9 14Z" fill="#2997FF" />
    </svg>
  </div>
);

// Decorative hook/chain SVG — large background element for Hooks scene
export const HookDecorationSVG: React.FC<{
  size?: number;
  opacity?: number;
  color?: string;
}> = ({ size = 420, opacity = 0.07, color = COLORS.blue }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" fill="none" style={{ opacity }}>
    {/* Chain link 1 */}
    <rect x="20" y="60" width="60" height="34" rx="17" stroke={color} strokeWidth="10" fill="none" />
    {/* Chain link 2 — overlapping */}
    <rect x="60" y="76" width="60" height="34" rx="17" stroke={color} strokeWidth="10" fill="none" />
    {/* Chain link 3 */}
    <rect x="100" y="60" width="60" height="34" rx="17" stroke={color} strokeWidth="10" fill="none" />
    {/* Hook shape at end */}
    <path
      d="M160 77 Q180 77 180 95 Q180 115 160 115 L140 115"
      stroke={color} strokeWidth="10" strokeLinecap="round" fill="none"
    />
    {/* Connector top */}
    <line x1="50" y1="60" x2="50" y2="40" stroke={color} strokeWidth="8" strokeLinecap="round" />
    <circle cx="50" cy="32" r="10" stroke={color} strokeWidth="8" fill="none" />
  </svg>
);

// Anthropic attribution badge
export const AnthropicBadge: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => (
  <div style={{
    opacity,
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 20px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 100,
  }}>
    <AnthropicMark size={16} color="rgba(240,240,248,0.5)" />
    <span style={{
      fontFamily: COLORS.sans,
      fontSize: 14,
      fontWeight: 500,
      color: "rgba(240,240,248,0.45)",
      letterSpacing: 1,
    }}>
      Anthropic
    </span>
  </div>
);
