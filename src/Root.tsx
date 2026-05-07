import { Composition } from "remotion";
import { ClaudeCodeReel, CLAUDE_CODE_REEL_TOTAL_FRAMES } from "./ClaudeCodeReel/ClaudeCodeReel";
import { Cover } from "./ClaudeCodeReel/Cover";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="ClaudeCodeReel"
      component={ClaudeCodeReel}
      durationInFrames={CLAUDE_CODE_REEL_TOTAL_FRAMES}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="Cover"
      component={Cover}
      durationInFrames={1}
      fps={30}
      width={1080}
      height={1920}
    />
  </>
);
