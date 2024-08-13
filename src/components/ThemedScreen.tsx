import { Colors } from "@/constants";
import React from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "./ThemedView";

export const ThemedScreen = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={[styles.view, style ? style : { marginTop: 24 }]}>
        {children}
      </ThemedView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    height: "100%",
    width: "100%",
    position: "relative",
  },
  view: {
    paddingHorizontal: 16,
    overflow: "hidden",
    gap: 16,
  },
});
