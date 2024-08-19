import { ThemedButton } from "@/components";
import { Colors } from "@/constants";
import { usePlaylistStore } from "@/store";
import { AntDesign } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";

const LibraryScreenLayout = () => {
  const router = useRouter();
  // Store
  const { resetCoverImage, resetPlaylistName } = usePlaylistStore();

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
          headerLeft: () => (
            <ThemedButton
              onPress={() => {
                resetCoverImage();
                resetPlaylistName();

                router.back();
              }}
              title="Back"
              size={"sm"}
              variant="ghost"
            >
              <AntDesign name="arrowleft" size={24} color={Colors.dark.text} />
            </ThemedButton>
          ),
        }}
      />
    </Stack>
  );
};

export default LibraryScreenLayout;
