import { Composition } from "remotion";
import { ClaudeCodeReel, CLAUDE_CODE_REEL_TOTAL_FRAMES } from "./ClaudeCodeReel/ClaudeCodeReel";

export const RemotionRoot: React.FC = () => (
  <Composition
    id="ClaudeCodeReel"
    component={ClaudeCodeReel}
    durationInFrames={CLAUDE_CODE_REEL_TOTAL_FRAMES}
    fps={30}
    width={1080}
    height={1920}
  />
);
