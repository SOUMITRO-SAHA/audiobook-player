import React from "react";
import { StyleSheet } from "react-native";
import FastImage from "react-native-fast-image";

interface FastImageComponentProps {
  style?: any;
  source: string | { uri: string };
}

export const FastImageComponent = ({
  style,
  source,
}: FastImageComponentProps) => {
  const uri = typeof source === "string" ? source : source.uri;

  return (
    <FastImage
      style={[styles.image, style]}
      source={{
        uri: uri || "https://unsplash.it/400/400?image=1",
        priority: FastImage.priority.normal,
      }}
      resizeMode={FastImage.resizeMode.contain}
    />
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    overflow: "hidden",
  },
});
