import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { Stack } from "expo-router";
import React from "react";

const LibraryScreenLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[param]"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default LibraryScreenLayout;
