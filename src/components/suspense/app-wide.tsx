import React from "react";
import { ThemedView } from "../ThemedView";
import { AntDesign } from "@expo/vector-icons";
import { Colors } from "@/constants";

export const AppWideSuspense = () => {
  return (
    <ThemedView className="items-center justify-center w-full h-full">
      <AntDesign
        name="loading2"
        size={28}
        color={Colors.dark.primaryForeground}
        className="animate-spin"
      />
    </ThemedView>
  );
};
