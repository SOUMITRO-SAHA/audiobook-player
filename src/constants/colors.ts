/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    background: "#ffffff",
    foreground: "#09090b",

    card: "#fff",
    cardForeground: "##09090b",

    primary: "#18181b",
    primaryForeground: "#fafafa",

    secondary: "#f4f4f5",
    secondaryForeground: "18181b",

    muted: "#f4f4f5",
    mutedForeground: "#71717a",

    destructive: "#ef4444",
    border: "#e4e4e7",
    text: "#e4e4e7",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },
  dark: {
    background: "#09090b",
    foreground: "#fafafa",

    card: "#09090b",
    cardForeground: "#fafafa",

    primary: "#f9991c",
    primaryForeground: "#18181b",

    secondary: "#27272a",
    secondaryForeground: "#fafafa",

    muted: "#27272a",
    mutedForeground: "#a1a1aa",

    destructive: "#7f1d1d",
    border: "#27272a",
    text: "#ECEDEE",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },
};
