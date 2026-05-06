import { AbsoluteFill, Audio, staticFile } from "remotion";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { fade } from "@remotion/transitions/fade";
import { Scene1Intro } from "./Scene1Intro";
import { Scene2WhatItDoes } from "./Scene2WhatItDoes";
import { Scene3Terminal } from "./Scene3Terminal";
import { Scene4Impact } from "./Scene4Impact";
import { Scene5CTA } from "./Scene5CTA";
import { ProgressBar } from "./ProgressBar";
import { FEATURE } from "./config";

const TRANSITION_FRAMES = 20;

export const SCENE_DURATIONS = {
  intro: 150,       // 5s
  whatItDoes: 180,  // 6s
  terminal: 300,    // 10s
  impact: 195,      // 6.5s
  cta: 165,         // 5.5s
};

export const CLAUDE_CODE_REEL_TOTAL_FRAMES =
  SCENE_DURATIONS.intro +
  SCENE_DURATIONS.whatItDoes +
  SCENE_DURATIONS.terminal +
  SCENE_DURATIONS.impact +
  SCENE_DURATIONS.cta;
// = 990 frames = 33 seconds at 30fps

const transition = springTiming({
  config: { damping: 200, stiffness: 180 },
  durationInFrames: TRANSITION_FRAMES,
});

export const ClaudeCodeReel: React.FC = () => {
  return (
    <AbsoluteFill>
      <Audio src={staticFile(FEATURE.audioFile)} volume={1} />
      <ProgressBar />

      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.intro}>
          <Scene1Intro />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={transition}
        />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.whatItDoes}>
          <Scene2WhatItDoes />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={transition}
        />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.terminal}>
          <Scene3Terminal />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={transition}
        />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.impact}>
          <Scene4Impact />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 30 })}
        />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.cta}>
          <Scene5CTA />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
