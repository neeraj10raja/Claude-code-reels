// Auto-generated config for the Claude Code Reels repo itself
// Edit any field, then re-render: npm run render -- --output out/autoreels-reel.mp4

export const FEATURE = {
  badge: "Open Source · GitHub",
  title: "AutoReels",
  subtitle: "Generate Instagram Reels\nfor Claude Code features",
  audioFile: "autoreels-voice.m4a",

  bullets: [
    { icon: "🎬", text: "5-scene animated reel, 33 seconds" },
    { icon: "🎙️", text: "Clone your voice automatically" },
    { icon: "⚡", text: "One command renders a ready MP4" },
    { icon: "🆓", text: "Fully free and open source" },
  ],

  terminal: {
    userMessage: "Create a reel about MCP servers",
    steps: [
      { tool: "setup.py",        input: "feature: mcp",      output: "Config written ✓",   color: "#2997FF", delay: 40,  duration: 30, isHook: false },
      { tool: "generate_voice",  input: "mcp narration",     output: "mcp-voice.m4a ✓",    color: "#2997FF", delay: 85,  duration: 30, isHook: false },
      { tool: "remotion render", input: "ClaudeCodeReel",    output: "mcp-reel.mp4 ready", color: "#34d399", delay: 130, duration: 25, isHook: false },
    ],
    summary: "✓ Ready-to-post reel in under 5 minutes.",
    summaryFrame: 220,
  },

  impact: {
    before: { value: "Hours",  detail: "Manual video editing per reel" },
    after:  { value: "5 min",  detail: "One command, done" },
    metric: "10×",
    metricSuffix: " faster",
    metricLabel: "reel production",
  },

  cta: {
    handle: "@claudecodereels",
    tagline: "New Claude Code feature every day",
    followText: "Follow for more",
  },
} as const;
