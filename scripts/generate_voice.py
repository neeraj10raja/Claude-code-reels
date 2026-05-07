"""
Voice cloning for Claude Code Reels using Chatterbox TTS.

Usage:
  # Use a built-in narration script
  python3 scripts/generate_voice.py --feature hooks --ref public/your-voice.m4a

  # Use your own narration text
  python3 scripts/generate_voice.py --feature hooks --ref public/your-voice.m4a \\
      --script "Your custom narration text goes here."

  # List built-in features
  python3 scripts/generate_voice.py --list

Requirements:
  pip install -r scripts/requirements.txt

Voice reference tips:
  - 10–30 seconds of clear speech, no background noise
  - Record in a quiet room, speaking naturally
  - WAV, MP3, or M4A format all work
"""
import argparse
import os
import subprocess
import sys

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC_DIR   = os.path.join(PROJECT_ROOT, "public")

# ── Built-in narration scripts ────────────────────────────────────────────────
# Add your own feature scripts here, or pass --script on the command line.
SCRIPTS: dict[str, str] = {
    "hooks": (
        "Claude Code just got a hidden superpower — Hooks. "
        "Hooks let you run any shell command automatically before or after every action Claude takes. "
        "Auto-format your code on every single file edit. "
        "Block dangerous commands before they even run. "
        "Chain Claude directly into your existing dev workflow — zero extra steps from you. "
        "Before Hooks? You'd manually format after every change. "
        "After Hooks? It just happens. Zero manual steps, every session. "
        "Follow for a new Claude Code feature every single day."
    ),
    "mcp": (
        "Claude Code can now connect to any external tool using MCP — the Model Context Protocol. "
        "Give Claude access to your database, your Slack, your GitHub, your browser — anything. "
        "Just add an MCP server to your config and Claude can read and write to those systems directly. "
        "No copy-pasting. No switching tabs. Your entire workflow, inside one terminal. "
        "Follow for a new Claude Code feature every single day."
    ),
    "subagents": (
        "Claude Code can now spin up sub-agents — parallel AI workers that each handle a different part of your task. "
        "One agent searches the codebase. Another writes the tests. Another reviews the output. "
        "All running at the same time, coordinated automatically. "
        "Complex tasks that used to take hours now take minutes. "
        "Follow for a new Claude Code feature every single day."
    ),
    "memory": (
        "Claude Code now remembers things across sessions. "
        "It keeps a persistent memory file that it reads at the start of every conversation. "
        "Your preferences, your project context, your past decisions — all there automatically. "
        "No more repeating yourself every time you open a new session. "
        "Follow for a new Claude Code feature every single day."
    ),
    "autoreels": (
        "So I built a tool that generates Instagram Reels about any topic — automatically. "
        "You just tell it what you want to cover, and it creates the animations, clones your voice, "
        "and renders a professional video ready to post. "
        "Developers, educators, marketers, creators — no editing skills needed. "
        "One command, one topic, one reel. "
        "Completely free and open source. Follow for more."
    ),
}
# ─────────────────────────────────────────────────────────────────────────────


DEFAULT_REF = os.path.join(PUBLIC_DIR, "voice-reference.m4a")


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate voice-cloned narration for Claude Code Reels")
    parser.add_argument("--feature", help="Feature name — used as the output filename (<feature>-voice.m4a)")
    parser.add_argument("--ref", default=None, help="Path to your voice reference audio (WAV/MP3/M4A, 10–30s). Defaults to public/voice-reference.m4a")
    parser.add_argument("--script", default=None, help="Custom narration text (overrides built-in)")
    parser.add_argument("--exaggeration", type=float, default=0.3,
                        help="Voice expressiveness 0.0 (flat) – 1.0 (very expressive). Default: 0.3")
    parser.add_argument("--list", action="store_true", help="List built-in feature scripts and exit")
    args = parser.parse_args()

    if args.list:
        print("Built-in feature scripts:")
        for key, text in SCRIPTS.items():
            print(f"  --feature {key:<14} {text[:70]}...")
        return

    if not args.feature:
        parser.error("--feature is required")

    ref = args.ref or DEFAULT_REF
    if not os.path.exists(ref):
        if args.ref:
            print(f"Error: voice reference not found: {ref}")
        else:
            print("No voice reference found at public/voice-reference.m4a.")
            print("Record 10–30s of yourself speaking and save it there, or pass --ref <path>.")
        sys.exit(1)

    if ref == DEFAULT_REF and not args.ref:
        print("Using included voice reference (public/voice-reference.m4a).")
        print("To use your own voice: --ref path/to/your-voice.m4a\n")

    narration = args.script or SCRIPTS.get(args.feature)
    if not narration:
        available = ", ".join(SCRIPTS.keys())
        print(f"No built-in script for '{args.feature}'.")
        print(f"Available built-ins: {available}")
        print(f"Or pass your own: --script 'Your narration here'")
        sys.exit(1)

    try:
        import torch
        import torchaudio
        from chatterbox.tts import ChatterboxTTS
    except ImportError:
        print("Missing dependencies. Run:\n  pip install -r scripts/requirements.txt")
        sys.exit(1)

    out_path = os.path.join(PUBLIC_DIR, f"{args.feature}-voice.m4a")

    print(f"Loading Chatterbox TTS model (downloads ~1.5 GB on first run)...")
    device = "mps" if torch.backends.mps.is_available() else "cuda" if torch.cuda.is_available() else "cpu"
    print(f"Device: {device}")
    model = ChatterboxTTS.from_pretrained(device=device)

    print(f"\nGenerating voice for feature: {args.feature}")
    print(f"Script ({len(narration.split())} words): {narration[:80]}...")

    wav = model.generate(
        narration,
        audio_prompt_path=ref,
        exaggeration=args.exaggeration,
        cfg_weight=0.5,
    )

    os.makedirs(PUBLIC_DIR, exist_ok=True)
    tmp_wav = out_path.replace(".m4a", "_tmp.wav")
    torchaudio.save(tmp_wav, wav, model.sr)

    # Convert WAV → AAC/M4A (macOS built-in afconvert)
    result = subprocess.run(
        ["afconvert", tmp_wav, out_path, "-f", "m4af", "-d", "aac"],
        capture_output=True,
    )
    os.remove(tmp_wav)

    if result.returncode != 0:
        # afconvert not available (Linux) — keep as WAV
        wav_out = out_path.replace(".m4a", ".wav")
        torchaudio.save(wav_out, wav, model.sr)
        print(f"\nSaved (WAV): {wav_out}")
        print("Note: update audioFile in config.ts to use the .wav filename")
    else:
        print(f"\nSaved: {out_path}")

    print(f"\nNext steps:")
    print(f"  1. Update config.ts → audioFile: '{args.feature}-voice.m4a'")
    print(f"  2. npm run render -- --output out/{args.feature}-reel.mp4")


if __name__ == "__main__":
    main()
