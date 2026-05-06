// Example config for the MCP (Model Context Protocol) feature reel.
// Copy this to src/ClaudeCodeReel/config.ts to use it.
//
// Voice: python3 scripts/generate_voice.py --feature mcp --ref public/your-voice.m4a

export const FEATURE = {
  badge: "Claude Code · New Feature",
  title: "MCP",
  subtitle: "Connect Claude to\nany external tool",
  audioFile: "mcp-voice.m4a",

  bullets: [
    { icon: "🔌", text: "Plug in any tool via MCP servers" },
    { icon: "🗄️", text: "Query your database directly" },
    { icon: "💬", text: "Post to Slack, GitHub, Notion" },
    { icon: "🌐", text: "Browse the web from your terminal" },
  ],

  terminal: {
    userMessage: "Find all open GitHub issues and summarise them",
    steps: [
      {
        tool: "MCP:github",
        input: "list_issues · repo=my-app · state=open",
        output: "23 open issues fetched",
        color: "#2997FF",
        delay: 55,
        duration: 30,
        isHook: false,
      },
      {
        tool: "MCP:github",
        input: "get_issue · #42, #51, #67",
        output: "Issue details retrieved",
        color: "#2997FF",
        delay: 100,
        duration: 28,
        isHook: false,
      },
      {
        tool: "MCP:slack",
        input: "post_message · #engineering · summary ready",
        output: "✓ Posted to Slack",
        color: "#a78bfa",
        delay: 145,
        duration: 22,
        isHook: false,
      },
    ],
    summary: "✓ GitHub → Claude → Slack. No browser opened.",
    summaryFrame: 200,
  },

  impact: {
    before: { value: "5 tabs", detail: "GitHub, Slack, docs open at once" },
    after:  { value: "1 cmd",  detail: "Claude does it all from terminal" },
    metric: "5",
    metricSuffix: " fewer tabs",
    metricLabel: "per task",
  },

  cta: {
    handle: "@your.handle",
    tagline: "New Claude Code feature every day",
    followText: "Follow for more",
  },
} as const;
