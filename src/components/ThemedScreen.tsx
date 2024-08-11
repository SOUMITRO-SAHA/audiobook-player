import { Colors } from "@/constants";
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "./ThemedView";

export const ThemedScreen = ({ children }: { children: React.ReactNode }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.view}>{children}</ThemedView>
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
    marginTop: 24,
    paddingHorizontal: 16,
    overflow: "hidden",
    gap: 16,
  },
});
