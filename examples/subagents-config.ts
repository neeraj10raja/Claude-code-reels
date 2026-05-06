// Example config for the Sub-agents feature reel.
// Copy this to src/ClaudeCodeReel/config.ts to use it.
//
// Voice: python3 scripts/generate_voice.py --feature subagents --ref public/your-voice.m4a

export const FEATURE = {
  badge: "Claude Code · New Feature",
  title: "Sub-agents",
  subtitle: "Parallel AI workers\nfor complex tasks",
  audioFile: "subagents-voice.m4a",

  bullets: [
    { icon: "🤖", text: "Spawn multiple agents at once" },
    { icon: "⚡", text: "Each handles a different subtask" },
    { icon: "🔄", text: "Results merged automatically" },
    { icon: "🚀", text: "Hours of work done in minutes" },
  ],

  terminal: {
    userMessage: "Add auth, tests, and docs for the new API endpoint",
    steps: [
      {
        tool: "Agent:1",
        input: "Implement JWT auth middleware",
        output: "auth.ts written · 87 lines",
        color: "#2997FF",
        delay: 40,
        duration: 35,
        isHook: false,
      },
      {
        tool: "Agent:2",
        input: "Write unit tests for the endpoint",
        output: "auth.test.ts written · 12 tests",
        color: "#a78bfa",
        delay: 50,
        duration: 35,
        isHook: false,
      },
      {
        tool: "Agent:3",
        input: "Generate OpenAPI documentation",
        output: "openapi.yaml updated",
        color: "#34d399",
        delay: 60,
        duration: 35,
        isHook: false,
      },
    ],
    summary: "✓ All 3 agents finished in parallel — 3× faster.",
    summaryFrame: 220,
  },

  impact: {
    before: { value: "45 min", detail: "Sequential: auth, then tests, then docs" },
    after:  { value: "15 min", detail: "All three run in parallel" },
    metric: "3",
    metricSuffix: "× faster",
    metricLabel: "with sub-agents",
  },

  cta: {
    handle: "@your.handle",
    tagline: "New Claude Code feature every day",
    followText: "Follow for more",
  },
} as const;
