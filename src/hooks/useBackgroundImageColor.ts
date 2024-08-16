import { Colors } from "@/constants";
import * as React from "react";
import { getColors, ImageColorsResult } from "react-native-image-colors";

type ColorType = {
  primary: string;
  secondary: string;
  raw: ImageColorsResult;
};

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
            primary: value.darkMuted,
            secondary: value.muted,
            raw: value,
          });
          break;
        case "web":
          setColors({
            primary: value.darkMuted,
            secondary: value.muted,
            raw: value,
          });
          break;
        case "ios":
          setColors({
            primary: value.background,
            secondary: value.detail,
            raw: value,
          });
        default:
          throw new Error("Unexpected platform");
      }
    });
  }, [imageUrl]);

  return colors;
};
