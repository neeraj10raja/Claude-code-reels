import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily: interFamily } = loadFont("normal", {
  weights: ["300", "400", "500", "700", "800", "900"],
});

export const COLORS = {
  bg: "#070710",
  bgGradient: "radial-gradient(ellipse 120% 60% at 50% 20%, #0f1525 0%, #070710 70%)",
  bgCard: "#0f0f1c",
  bgCardHover: "#141428",
  border: "rgba(100, 120, 255, 0.14)",
  borderBright: "rgba(100, 120, 255, 0.4)",
  blue: "#2997FF",
  blueDim: "rgba(41, 151, 255, 0.14)",
  blueGlow: "rgba(41, 151, 255, 0.35)",
  green: "#34d399",
  greenDim: "rgba(52, 211, 153, 0.14)",
  purple: "#a78bfa",
  purpleDim: "rgba(167, 139, 250, 0.14)",
  gold: "#fbbf24",
  red: "#f87171",
  text: "#f0f0f8",
  textMuted: "rgba(240, 240, 248, 0.5)",
  textDim: "rgba(240, 240, 248, 0.28)",
  mono: "'Courier New', 'Menlo', monospace",
  sans: interFamily,
};
