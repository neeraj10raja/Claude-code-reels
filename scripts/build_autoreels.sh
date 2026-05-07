#!/usr/bin/env bash
# Generates the autoreels voice and renders the final MP4.
# Usage:
#   bash scripts/build_autoreels.sh
#   bash scripts/build_autoreels.sh --ref public/my-voice.m4a

set -e
cd "$(dirname "$0")/.."

REF="public/voice-reference.m4a"
while [[ $# -gt 0 ]]; do
  case $1 in
    --ref) REF="$2"; shift 2 ;;
    *) echo "Unknown arg: $1"; exit 1 ;;
  esac
done

echo "→ Generating voice narration..."
python3 scripts/generate_voice.py --feature autoreels --ref "$REF"

echo "→ Pointing config to autoreels-voice.m4a..."
sed -i '' 's/audioFile: ".*"/audioFile: "autoreels-voice.m4a"/' src/ClaudeCodeReel/config.ts

echo "→ Rendering reel..."
npx remotion render ClaudeCodeReel \
  --output out/autoreels-reel.mp4 \
  --codec h264 --crf 8

echo ""
echo "✓ Done → out/autoreels-reel.mp4"
