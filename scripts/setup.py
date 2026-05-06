#!/usr/bin/env python3
"""
Interactive setup wizard for Claude Code Reels.

Run this once to configure everything, then any time you want to create a new reel.

  python3 scripts/setup.py
"""

import os
import shutil
import subprocess
import sys
import textwrap

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC_DIR   = os.path.join(PROJECT_ROOT, "public")
SCRIPTS_DIR  = os.path.join(PROJECT_ROOT, "scripts")
CONFIG_PATH  = os.path.join(PROJECT_ROOT, "src", "ClaudeCodeReel", "config.ts")
DEFAULT_REF  = os.path.join(PUBLIC_DIR, "voice-reference.m4a")

# ── ANSI colours ──────────────────────────────────────────────────────────────

RESET  = "\033[0m"
BOLD   = "\033[1m"
DIM    = "\033[2m"
GREEN  = "\033[32m"
YELLOW = "\033[33m"
CYAN   = "\033[36m"
RED    = "\033[31m"
WHITE  = "\033[97m"
PURPLE = "\033[35m"


def c(color: str, text: str) -> str:
    return f"{color}{text}{RESET}"


def ok(msg: str)   -> None: print(c(GREEN,  f"  ✓  {msg}"))
def warn(msg: str) -> None: print(c(YELLOW, f"  ⚠  {msg}"))
def err(msg: str)  -> None: print(c(RED,    f"  ✗  {msg}"))
def info(msg: str) -> None: print(c(CYAN,   f"  →  {msg}"))
def dim(msg: str)  -> None: print(c(DIM,    f"     {msg}"))


def hr(char: str = "─", width: int = 60) -> None:
    print(c(DIM, char * width))


def section(title: str) -> None:
    print()
    hr()
    print(c(BOLD + WHITE, f"  {title}"))
    hr()


def banner() -> None:
    print()
    print(c(PURPLE, "  ╔══════════════════════════════════════════════════════╗"))
    print(c(PURPLE, "  ║") + c(BOLD + WHITE, "          Claude Code Reels  —  Setup Wizard          ") + c(PURPLE, "║"))
    print(c(PURPLE, "  ║") + c(DIM,          "    Generate Instagram Reels for Claude Code features  ") + c(PURPLE, "║"))
    print(c(PURPLE, "  ╚══════════════════════════════════════════════════════╝"))
    print()


def ask(prompt: str, default: str = "", secret: bool = False) -> str:
    """Prompt the user for input, showing default in brackets."""
    if default:
        display = f"{c(CYAN, prompt)} {c(DIM, f'[{default}]')}: "
    else:
        display = f"{c(CYAN, prompt)}: "

    try:
        if secret:
            import getpass
            value = getpass.getpass(display)
        else:
            value = input(display).strip()
    except (KeyboardInterrupt, EOFError):
        print()
        print(c(YELLOW, "\nWizard cancelled. Run again any time: python3 scripts/setup.py"))
        sys.exit(0)

    return value or default


def confirm(prompt: str, default: bool = True) -> bool:
    hint = "Y/n" if default else "y/N"
    raw = ask(f"{prompt} ({hint})")
    if not raw:
        return default
    return raw.lower() in ("y", "yes")


def run(cmd: list[str], capture: bool = False, **kwargs):
    if capture:
        return subprocess.run(cmd, cwd=PROJECT_ROOT, capture_output=True, text=True, **kwargs)
    return subprocess.run(cmd, cwd=PROJECT_ROOT, **kwargs)


def run_or_die(cmd: list[str], fail_msg: str) -> None:
    rc = run(cmd).returncode
    if rc != 0:
        err(fail_msg)
        sys.exit(1)


# ── Individual checks ─────────────────────────────────────────────────────────


def check_node() -> bool:
    result = run(["node", "--version"], capture=True)
    if result.returncode != 0:
        return False
    ver = result.stdout.strip().lstrip("v")
    major = int(ver.split(".")[0])
    return major >= 18


def check_npm_deps() -> bool:
    return os.path.isdir(os.path.join(PROJECT_ROOT, "node_modules", "remotion"))



def check_python_deps() -> bool:
    try:
        import torch        # noqa: F401
        import torchaudio   # noqa: F401
        from chatterbox.tts import ChatterboxTTS  # noqa: F401
        return True
    except ImportError:
        return False


def check_voice_ref() -> bool:
    return os.path.exists(DEFAULT_REF) and os.path.getsize(DEFAULT_REF) > 1000


# ── Setup steps ───────────────────────────────────────────────────────────────


def setup_node() -> None:
    section("Step 1 — Node.js & npm packages")
    if not shutil.which("node"):
        err("Node.js not found.")
        info("Install it from https://nodejs.org (version 18 or higher)")
        sys.exit(1)

    if not check_node():
        err("Node.js 18+ is required.")
        result = run(["node", "--version"], capture=True)
        dim(f"Your version: {result.stdout.strip()}")
        sys.exit(1)

    result = run(["node", "--version"], capture=True)
    ok(f"Node.js {result.stdout.strip()}")

    if check_npm_deps():
        ok("npm packages already installed")
    else:
        info("Installing npm packages (Remotion, React, etc.)...")
        run_or_die(["npm", "install"], "npm install failed. Check your internet connection.")
        ok("npm packages installed")




def setup_python() -> bool:
    section("Step 3 — Python & voice cloning (optional)")
    print(textwrap.dedent(f"""
     {c(DIM, 'Voice cloning uses Chatterbox TTS to read your narration in your own voice.')}
     {c(DIM, 'Skip this to use the included sample voice and render immediately.')}
    """))

    if check_python_deps():
        ok("Chatterbox TTS already installed")
        return True

    if not confirm("Install Python voice cloning dependencies?", default=False):
        warn("Skipping voice setup — will use included sample voice")
        return False

    req = os.path.join(SCRIPTS_DIR, "requirements.txt")
    info("Installing requirements.txt (downloads ~1.5 GB torch on first run)...")
    rc = run([sys.executable, "-m", "pip", "install", "-r", req]).returncode
    if rc != 0:
        err("pip install failed.")
        dim("Try: pip install torch==2.6.0 torchaudio==2.6.0 --index-url https://download.pytorch.org/whl/cpu")
        return False

    ok("Voice cloning dependencies installed")
    return True


def setup_voice_ref(python_ready: bool) -> str | None:
    section("Step 4 — Your voice reference (optional)")
    print(textwrap.dedent(f"""
     {c(DIM, 'Record 20–30 seconds of yourself speaking naturally.')}
     {c(DIM, 'The AI uses this to clone your voice for every reel.')}
    """))

    if check_voice_ref():
        ok("public/voice-reference.m4a already exists")
        if confirm("Use this recording?", default=True):
            return DEFAULT_REF
        # Fall through to re-record

    print(c(BOLD, "  Read this script aloud into your phone or mic:"))
    print()
    script = (
        '"Hey everyone, welcome back. Today I want to show you something really cool '
        "I've been working on. Claude Code has been getting a lot of new features lately "
        "and I think this one is going to save you a lot of time. Let me walk you through "
        "exactly how it works and why it matters for your daily workflow. If you're the kind "
        "of developer who's always looking for ways to move faster without sacrificing quality, "
        'then stick around — this one\'s for you."'
    )
    wrapped = textwrap.fill(script, width=56, initial_indent="     ", subsequent_indent="     ")
    print(c(YELLOW, wrapped))
    print()
    dim("Then save it as an M4A or WAV file.")
    print()

    while True:
        path = ask("Path to your voice recording", default="skip")
        if path.lower() in ("skip", "s", ""):
            warn("Skipping — will use included sample voice")
            return None

        path = os.path.expanduser(path)
        if not os.path.exists(path):
            err(f"File not found: {path}")
            continue

        dest = DEFAULT_REF
        shutil.copy2(path, dest)
        ok(f"Copied to public/voice-reference.m4a")
        return dest


# ── Reel creation ─────────────────────────────────────────────────────────────


def ask_reel_details() -> tuple[str, str]:
    section("Your reel")
    print(c(DIM, "  Edit src/ClaudeCodeReel/config.ts to customise every scene.\n"))

    print(c(DIM, "  Feature examples:"))
    dim("  • hooks          — auto-run shell commands on every Claude action")
    dim("  • mcp            — connect Claude to any external tool")
    dim("  • subagents      — parallel AI workers for complex tasks")
    dim("  • memory         — context that persists across sessions")
    print()

    feature = ask("Feature slug (used as the output filename, e.g. hooks)", default="hooks")
    handle  = ask("Your Instagram handle", default="@your.handle")
    return feature, handle


def run_pipeline(feature: str, handle: str, ref: str | None, python_ready: bool) -> None:
    section("Voice + render")

    use_voice = python_ready and check_voice_ref()

    if use_voice:
        narration = ask(
            "Narration text (or press Enter to use the built-in script if one exists)",
            default="",
        )
        voice_script = os.path.join(SCRIPTS_DIR, "generate_voice.py")
        cmd = [sys.executable, voice_script, "--feature", feature]
        if ref and ref != DEFAULT_REF:
            cmd += ["--ref", ref]
        if narration:
            cmd += ["--script", narration]
        print()
        info("Generating voice narration...")
        rc = run(cmd).returncode
        if rc != 0:
            warn("Voice generation failed — skipping audio.")
    else:
        info("Using included voice (public/voice-reference.m4a).")
        dim("To use your own voice later: python3 scripts/generate_voice.py --feature " + feature)

    auto_render = confirm("\nRender the MP4 now? (takes 2–4 minutes)", default=True)
    if auto_render:
        out = os.path.join(PROJECT_ROOT, "out", f"{feature}-reel.mp4")
        info("Rendering...")
        run(["npx", "remotion", "render", "ClaudeCodeReel",
             "--output", out, "--codec", "h264", "--crf", "8"])
        ok(f"Reel saved: out/{feature}-reel.mp4")
    else:
        section("Next steps")
        print(textwrap.dedent(f"""
         Edit config:   {c(CYAN, 'src/ClaudeCodeReel/config.ts')}
         Live preview:  {c(CYAN, 'npm run dev')}
         Render:        {c(CYAN, f'npm run render -- --output out/{feature}-reel.mp4')}
        """))


# ── Entrypoint ────────────────────────────────────────────────────────────────


def main() -> None:
    banner()

    print(c(DIM, "  This wizard walks you through one-time setup and reel creation."))
    print(c(DIM, "  Press Ctrl-C at any time to exit. Run again to resume.\n"))

    first_time = not check_npm_deps()
    if first_time:
        print(c(YELLOW, "  Looks like a fresh install — let's get you set up.\n"))
    else:
        print(c(GREEN, "  Environment looks good. Let's make a reel.\n"))

    setup_node()
    py_ready = setup_python()
    ref      = setup_voice_ref(py_ready) if py_ready else None

    feature, handle = ask_reel_details()
    run_pipeline(feature, handle, ref, py_ready)

    section("Done!")
    print(c(GREEN + BOLD, "  Your reel is ready. Go post it! 🚀"))
    print()
    dim("  Run this wizard again any time: python3 scripts/setup.py")
    print()


if __name__ == "__main__":
    main()
