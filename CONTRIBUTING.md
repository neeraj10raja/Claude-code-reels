# Contributing

Thanks for your interest in contributing!

## Adding a new feature narration script

Open `scripts/generate_voice.py` and add your entry to the `SCRIPTS` dict:

```python
SCRIPTS = {
    "hooks": "...",
    "mcp": "...",
    "your-feature": (
        "Your narration text here. "
        "Keep it under 90 words — about 30 seconds of speech. "
        "End with: Follow for a new Claude Code feature every single day."
    ),
}
```

Then open a PR with:
- The new script entry
- A matching example `config.ts` in `examples/`

## Adding an example config

Copy `src/ClaudeCodeReel/config.ts` to `examples/<feature>-config.ts` and fill it in completely, so someone can drop it straight in and render.

## Bug reports

Open an issue with:
- Your OS + Node + Python versions
- The exact command that failed
- The full error output
