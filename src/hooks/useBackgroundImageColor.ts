import { Colors } from "@/constants";
import * as React from "react";
import { getColors, ImageColorsResult } from "react-native-image-colors";

type ColorType = {
  primary: string;
  secondary: string;
  tertiary?: string;
  raw: ImageColorsResult;
};

/**
  Platform `Android`
  
  const demo = {
    primary: "#506088",
    raw: {
      average: "#232125",
      darkMuted: "#506088",
      darkVibrant: "#486898",
      dominant: "#305080",
      lightMuted: "#8090B8",
      lightVibrant: "#F9991C",
      muted: "#5070A8",
      platform: "android",
      vibrant: "#305080",
    },
    secondary: "#5070A8",
  };
*/

export const useBackgroundImageColor = (url: string) => {
  const [colors, setColors] = React.useState<ColorType | null>(null);

  const imageUrl = React.useMemo(() => url, [url]);

  // Side Effects
  React.useEffect(() => {
    getColors(imageUrl, {
      fallback: Colors.dark.primary,
      cache: true,
      key: imageUrl,
    }).then((value) => {
      switch (value.platform) {
        case "android":
          setColors({
            primary: value.lightVibrant,
            secondary: value.vibrant,
            tertiary: value.muted,
            raw: value,
          });
          break;
        case "web":
          setColors({
            primary: value.darkMuted,
            secondary: value.lightVibrant,
            tertiary: value.muted,
            raw: value,
          });
          break;
        case "ios":
          setColors({
            primary: value.background,
            secondary: value.secondary,
            raw: value,
          });
        default:
          throw new Error("Unexpected platform");
      }
    });
  }, [imageUrl]);

  return colors;
};
