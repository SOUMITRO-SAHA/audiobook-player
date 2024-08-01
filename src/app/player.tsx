import { screenPadding } from "@/constants";
import { defaultStyles } from "@/styles";
import React from "react";
import { StyleSheet } from "react-native";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PlayerScreen = () => {
  return (
    <View style={styles.overlayContainer}>
      <DismissPlayerSymbol />
    </View>
  );
};

const DismissPlayerSymbol = () => {
  const { top } = useSafeAreaInsets();

  return (
    <View style={[{ top: top + 8 }, styles.dismissContainer]}>
      <View
        accessible={false}
        style={{
          width: 50,
          height: 8,
          borderRadius: 8,
          backgroundColor: "#fff",
          opacity: 0.7,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    ...defaultStyles.container,
    paddingHorizontal: screenPadding.horizontal,
    backgroundColor: "rgba(0,0,0, 0.5)",
  },
  dismissContainer: {
    position: "absolute",
    // top: 20,
    left: 0,
    right: 0,
    padding: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
});

export default PlayerScreen;
