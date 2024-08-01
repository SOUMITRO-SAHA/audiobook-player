import { Colors } from "@/constants";
import useLastActiveTrack from "@/hooks/useLastActiveTrack";
import { SimpleLineIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useActiveTrack } from "react-native-track-player";
import { ThemedView } from "../ThemedView";
import { MovingText } from "./moving-text";
import { PlayPauseButton, SkipToNextButton } from "./player-control";

export const FloatingPlayer = () => {
  const activeTrack = useActiveTrack();
  const lastActiveTrack = useLastActiveTrack();

  const displayTrack = activeTrack ?? lastActiveTrack;
  console.log("Count", Date.now());
  if (!displayTrack) return null;

  // Router
  // const router = useRouter();

  const handlePressThreeDots = () => {
    // setIsActive(!isActive);
  };

  const handlePress = () => {
    // router.navigate("/player");
  };

  return (
    <View
      className="absolute p-2 px-5 bottom-14 rounded-xl"
      style={styles.container}
    >
      <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
        {/* <Image source={activeTrack.artwork} style={styles.trackArtWorkImage} /> */}
        <View className="flex flex-row items-center space-x-2 max-w-[80%]">
          <ThemedView className="flex items-center justify-center w-12 h-12 p-1 rounded">
            <SimpleLineIcons
              name="music-tone-alt"
              size={24}
              color={Colors.dark.foreground}
            />
          </ThemedView>
          <View className="w-[98%] overflow-hidden">
            <MovingText
              text={String(displayTrack.title)}
              animationThreshold={25}
              style={{
                overflow: "hidden",
              }}
            />
          </View>
        </View>
      </TouchableOpacity>

      {/* Buttons */}
      <View className="flex flex-row items-center justify-end space-x-4">
        <PlayPauseButton className="w-6" size={28} />
        <SkipToNextButton className="w-6" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    left: 8,
    right: 8,
    backgroundColor: Colors.dark.muted,
  },
  trackArtWorkImage: {},
});
