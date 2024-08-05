import { Colors } from "@/constants";
import * as React from "react";
import { getColors } from "react-native-image-colors";
import { AndroidImageColors } from "react-native-image-colors/build/types";

export const usePlayerBackground = (imageUrl: string) => {
  const [imageColors, setImageColors] =
    React.useState<AndroidImageColors | null>(null);

  // Side Effect
  React.useEffect(() => {
    getColors(imageUrl, {
      fallback: Colors.dark.primary,
      cache: true,
      key: imageUrl,
    })
      .then((colors) => setImageColors(colors as AndroidImageColors))
      .catch((error) => {
        console.error(error);
      });
  }, [imageUrl]);

  return { imageColors };
};
