// Auto-generated config — edit any field, then re-render:
// npm run render -- --output out/autoreels-reel.mp4

export const FEATURE = {
  badge: "Free & Open Source",
  title: "AutoReels",
  subtitle: "Turn any topic into a\nprofessional Instagram Reel",
  audioFile: "autoreels-voice.m4a",

  bullets: [
    { icon: "🎯", text: "Any topic, any niche, any audience" },
    { icon: "🎙️", text: "Clone your voice automatically" },
    { icon: "⚡", text: "One command, ready-to-post MP4" },
    { icon: "🆓", text: "100% free and open source" },
  ],

  terminal: {
    userMessage: "Create a reel about productivity tips for developers",
    steps: [
      { tool: "setup.py",        input: "topic: productivity tips",  output: "Config written ✓",      color: "#2997FF", delay: 40,  duration: 30, isHook: false },
      { tool: "generate_voice",  input: "cloning your voice...",     output: "voice.m4a ready ✓",     color: "#a78bfa", delay: 85,  duration: 30, isHook: false },
      { tool: "remotion render", input: "5 animated scenes",         output: "reel.mp4  30s  7 MB ✓", color: "#34d399", delay: 130, duration: 25, isHook: false },
    ],
    summary: "✓ Professional reel ready to post in under 5 minutes.",
    summaryFrame: 220,
  },

  impact: {
    before: { value: "Hours",  detail: "Manual recording & editing" },
    after:  { value: "5 min",  detail: "One command, done" },
    metric: "10×",
    metricSuffix: " faster",
    metricLabel: "than traditional video creation",
  },

  cta: {
    handle: "@claudecodereels",
    tagline: "Open source tools for Claude Code",
    followText: "Follow for more",
  },
} as const;
