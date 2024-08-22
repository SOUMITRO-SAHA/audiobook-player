import { Colors } from "@/constants";
import { SimpleLineIcons } from "@expo/vector-icons";
import * as React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useActiveTrack } from "react-native-track-player";
import { ThemedView } from "../ThemedView";
import { MovingText } from "./moving-text";
import { PlayPauseButton, SkipToNextButton } from "./player-control";
import { useSegments } from "expo-router";
import { FastImageComponent } from "../image";

export type FloatingPlayerProps = {
  onNavigate: () => void;
};

export const FloatingPlayer = ({ onNavigate }: FloatingPlayerProps) => {
  const activeTrack = useActiveTrack();

  const segments = useSegments();

  const handleButtonPress = () => {
    onNavigate?.();
  };

  // Hide the floating player when on the player screen
  const isPlayerScreen = segments[segments.length - 1] === "player";
  if (!activeTrack || isPlayerScreen) return null;

  return (
    <View className="absolute p-2 px-5 rounded-xl" style={styles.container}>
      <TouchableOpacity activeOpacity={0.9} onPress={handleButtonPress}>
        <View className="flex flex-row items-center space-x-2 max-w-[80%]">
          <View className="w-12 h-12 bg-transparent rounded">
            {activeTrack.artwork ? (
              <FastImageComponent
                source={activeTrack.artwork}
                style={[
                  {
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: 10,
                  },
                ]}
              />
            ) : (
              <ThemedView className="flex items-center justify-center w-12 h-12 p-1 rounded">
                <SimpleLineIcons
                  name="music-tone-alt"
                  size={24}
                  color={Colors.dark.foreground}
                />
              </ThemedView>
            )}
          </View>

          <View className="w-[98%] overflow-hidden">
            <MovingText
              text={String(activeTrack?.title)}
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
    bottom: 70,
    backgroundColor: Colors.dark.muted,
  },
  trackArtWorkImage: {},
});
