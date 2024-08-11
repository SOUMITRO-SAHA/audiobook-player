import { Colors } from "@/constants";
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
          headerShown: true,
          headerStyle: {
            backgroundColor: Colors.dark.muted,
          },
          headerTintColor: Colors.dark.text,
        }}
      />
    </Stack>
  );
};

export default LibraryScreenLayout;
