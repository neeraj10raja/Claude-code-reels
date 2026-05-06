#!/usr/bin/env python3
"""
Generate a complete Claude Code Reel from a single topic description.
Claude writes the config, narration, and optionally renders the video.

Usage:
  python3 scripts/create_reel.py --topic "MCP servers"
  python3 scripts/create_reel.py --topic "Sub-agents" --handle @myhandle --render
  python3 scripts/create_reel.py --topic "Hooks" --ref public/my-voice.m4a --render

Requirements:
  pip install anthropic          (for config generation)
  pip install -r scripts/requirements.txt  (for voice cloning)

Set your API key:
  export ANTHROPIC_API_KEY=sk-ant-...
"""

import argparse
import json
import os
import subprocess
import sys

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONFIG_PATH  = os.path.join(PROJECT_ROOT, "src", "ClaudeCodeReel", "config.ts")
PUBLIC_DIR   = os.path.join(PROJECT_ROOT, "public")
DEFAULT_REF  = os.path.join(PUBLIC_DIR, "voice-reference.m4a")

# Load .env.local so the setup wizard's saved API key is picked up automatically
_env_file = os.path.join(PROJECT_ROOT, ".env.local")
if os.path.exists(_env_file):
    for _line in open(_env_file):
        _line = _line.strip()
        if _line and not _line.startswith("#") and "=" in _line:
            _k, _v = _line.split("=", 1)
            os.environ.setdefault(_k.strip(), _v.strip())

# ── Claude prompt ─────────────────────────────────────────────────────────────

SYSTEM = "You generate Instagram Reel configs for Claude Code features. Return ONLY raw JSON, no markdown."

PROMPT = """\
Generate an Instagram Reel config for the Claude Code feature: "{topic}"

Return this exact JSON (raw, no markdown fences):
{{
  "slug": "url-safe-feature-name",
  "title": "Feature Name (1-3 words, shown very large)",
  "subtitle": "One punchy line\\noptional second line",
  "narration": "75-85 word voiceover. Hook opening like 'Claude Code just got...' Explain what it does, one concrete example, the before/after difference. End with: Follow for a new Claude Code feature every single day.",
  "bullets": [
    {{"icon": "emoji", "text": "Benefit phrased as action, under 8 words"}},
    {{"icon": "emoji", "text": "Benefit phrased as action, under 8 words"}},
    {{"icon": "emoji", "text": "Benefit phrased as action, under 8 words"}},
    {{"icon": "emoji", "text": "Benefit phrased as action, under 8 words"}}
  ],
  "terminal": {{
    "userMessage": "Realistic message a user would type to Claude",
    "steps": [
      {{"tool": "ToolName", "input": "file or args", "output": "short result", "color": "#2997FF", "delay": 40, "duration": 30, "isHook": false}},
      {{"tool": "ToolName", "input": "file or args", "output": "short result", "color": "#2997FF", "delay": 85, "duration": 30, "isHook": false}},
      {{"tool": "ToolName", "input": "file or args", "output": "short result", "color": "#34d399", "delay": 130, "duration": 25, "isHook": false}}
    ],
    "summary": "✓ One line showing what Claude accomplished cleanly.",
    "summaryFrame": 220
  }},
  "impact": {{
    "before": {{"value": "Short (1-2 words)", "detail": "The painful manual way"}},
    "after":  {{"value": "Short (1-2 words)", "detail": "The new automatic way"}},
    "metric": "a number or short word",
    "metricSuffix": " unit of improvement",
    "metricLabel": "context (e.g. per session)"
  }}
}}

Rules:
- title: max 15 chars, punchy
- subtitle: max 45 chars per line, use \\n for line break
- narration: exactly 75-85 words, conversational, not salesy
- bullets: each under 35 chars, start with a verb
- terminal steps: realistic tool names Claude Code actually uses (Read, Edit, Bash, Write, MCP:toolname)
- impact before/after values: max 8 chars each
"""

# ─────────────────────────────────────────────────────────────────────────────


def call_claude(topic: str) -> dict:
    try:
        import anthropic
    except ImportError:
        print("Error: anthropic package not installed.")
        print("Run: pip install anthropic")
        sys.exit(1)

    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("Error: ANTHROPIC_API_KEY not set.")
        print("Run: export ANTHROPIC_API_KEY=sk-ant-...")
        sys.exit(1)

    client = anthropic.Anthropic(api_key=api_key)
    print(f"Generating reel config for: {topic}")

    response = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=2000,
        system=SYSTEM,
        messages=[{"role": "user", "content": PROMPT.format(topic=topic)}],
    )

    raw = response.content[0].text.strip()
    # Strip markdown fences if Claude added them despite instructions
    if raw.startswith("```"):
        raw = "\n".join(raw.split("\n")[1:])
        if raw.endswith("```"):
            raw = raw[: raw.rfind("```")]

    try:
        return json.loads(raw)
    except json.JSONDecodeError as e:
        print(f"Error: Claude returned invalid JSON.\n{e}\n\nRaw response:\n{raw}")
        sys.exit(1)


def build_config_ts(data: dict, handle: str) -> tuple[str, str]:
    slug = data["slug"]
    audio = f"{slug}-voice.m4a"

    def ts_step(s: dict) -> str:
        hook = "true" if s["isHook"] else "false"
        return (
            f'      {{ tool: "{s["tool"]}", input: "{s["input"]}", '
            f'output: "{s["output"]}", color: "{s["color"]}", '
            f'delay: {s["delay"]}, duration: {s["duration"]}, isHook: {hook} }},'
        )

    def ts_bullet(b: dict) -> str:
        return f'    {{ icon: "{b["icon"]}", text: "{b["text"]}" }},'

    steps   = "\n".join(ts_step(s) for s in data["terminal"]["steps"])
    bullets = "\n".join(ts_bullet(b) for b in data["bullets"])

    config = f"""\
// Auto-generated by scripts/create_reel.py
// Edit any field, then re-render: npm run render -- --output out/{slug}-reel.mp4

export const FEATURE = {{
  badge: "Claude Code · New Feature",
  title: "{data['title']}",
  subtitle: "{data['subtitle']}",
  audioFile: "{audio}",

  bullets: [
{bullets}
  ],

  terminal: {{
    userMessage: "{data['terminal']['userMessage']}",
    steps: [
{steps}
    ],
    summary: "{data['terminal']['summary']}",
    summaryFrame: {data['terminal']['summaryFrame']},
  }},

  impact: {{
    before: {{ value: "{data['impact']['before']['value']}", detail: "{data['impact']['before']['detail']}" }},
    after:  {{ value: "{data['impact']['after']['value']}",  detail: "{data['impact']['after']['detail']}" }},
    metric: "{data['impact']['metric']}",
    metricSuffix: "{data['impact']['metricSuffix']}",
    metricLabel: "{data['impact']['metricLabel']}",
  }},

  cta: {{
    handle: "{handle}",
    tagline: "New Claude Code feature every day",
    followText: "Follow for more",
  }},
}} as const;
"""
    return config, slug


def run(cmd: list[str], **kwargs) -> int:
    return subprocess.run(cmd, cwd=PROJECT_ROOT, **kwargs).returncode


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Generate a Claude Code Reel from a topic — Claude writes everything."
    )
    parser.add_argument(
        "--topic", required=True,
        help='Feature to cover, e.g. "MCP servers" or "Sub-agents" or "memory across sessions"',
    )
    parser.add_argument(
        "--handle", default="@your.handle",
        help="Your Instagram handle (shown on the CTA slide)",
    )
    parser.add_argument(
        "--ref", default=None,
        help="Voice reference file (default: public/voice-reference.m4a)",
    )
    parser.add_argument(
        "--voice", action="store_true",
        help="Generate voice narration after writing config",
    )
    parser.add_argument(
        "--render", action="store_true",
        help="Render the MP4 after generating config + voice",
    )
    args = parser.parse_args()

    # ── Step 1: ask Claude for the full config ────────────────────────────────
    data = call_claude(args.topic)
    narration = data.pop("narration")

    # ── Step 2: write config.ts ───────────────────────────────────────────────
    config_ts, slug = build_config_ts(data, args.handle)
    with open(CONFIG_PATH, "w") as f:
        f.write(config_ts)

    print(f"\n✓ config.ts written  →  {data['title']}")
    print(f"  Narration ({len(narration.split())} words):")
    print(f"  \"{narration[:120]}...\"" if len(narration) > 120 else f"  \"{narration}\"")

    # ── Step 3 (optional): generate voice ────────────────────────────────────
    if args.voice or args.render:
        ref = args.ref or DEFAULT_REF
        voice_script = os.path.join(PROJECT_ROOT, "scripts", "generate_voice.py")
        print(f"\nGenerating voice narration...")
        rc = run([sys.executable, voice_script,
                  "--feature", slug,
                  "--ref", ref,
                  "--script", narration])
        if rc != 0:
            print(f"\nVoice generation failed. Fix the error above, then run manually:")
            print(f"  python3 scripts/generate_voice.py --feature {slug} \\")
            print(f"      --ref {ref} --script \"{narration[:60]}...\"")
            if args.render:
                sys.exit(1)

    # ── Step 4 (optional): render ─────────────────────────────────────────────
    if args.render:
        out = os.path.join(PROJECT_ROOT, "out", f"{slug}-reel.mp4")
        print(f"\nRendering reel (this takes 2–4 minutes)...")
        run(["npx", "remotion", "render", "ClaudeCodeReel",
             "--output", out, "--codec", "h264", "--crf", "8"])
        print(f"\n✓ Reel ready:  out/{slug}-reel.mp4")
        return

    # ── Print next steps if not auto-rendering ────────────────────────────────
    print(f"\nNext steps:")
    if not args.voice:
        print(f"  1. Generate voice:")
        print(f"     python3 scripts/generate_voice.py --feature {slug}")
    step = 1 if args.voice else 2
    print(f"  {step}. Render:")
    print(f"     npm run render -- --output out/{slug}-reel.mp4")
    print(f"\n  Or do both in one command:")
    print(f"     python3 scripts/create_reel.py --topic \"{args.topic}\" --render")


if __name__ == "__main__":
    main()
