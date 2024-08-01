import { Colors } from "@/constants";
import { cn } from "@/lib/utils";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import { View, ViewStyle } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import TrackPlayer, { useIsPlaying } from "react-native-track-player";

interface PlayerControlProps {
  style?: ViewStyle;
  className?: string;
}

interface PlayerControlButtonProps {
  size?: number;
  style?: ViewStyle;
  className?: string;
}

export const PlayPauseButton = ({
  size = 28,
  style,
  className,
}: PlayerControlButtonProps) => {
  const { playing } = useIsPlaying();

  return (
    <View style={[style]} className={cn(className)}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={
          playing
            ? async () => {
                await TrackPlayer.pause();
              }
            : async () => {
                await TrackPlayer.play();
              }
        }
      >
        <FontAwesome
          name={playing ? "pause" : "play"}
          size={size}
          color={Colors.dark.foreground}
        />
      </TouchableOpacity>
    </View>
  );
};

export const SkipToNextButton = ({
  size = 20,
  style,
  className,
}: PlayerControlButtonProps) => {
  return (
    <View className={cn(className)} style={[{ height: size }, style]}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={async () => {
          await TrackPlayer.skipToNext();
        }}
      >
        <FontAwesome6
          name="forward"
          size={size}
          color={Colors.dark.foreground}
        />
      </TouchableOpacity>
    </View>
  );
};

export const SkipToPreviousButton = ({
  size = 20,
  style,
  className,
}: PlayerControlButtonProps) => {
  return (
    <View className={cn(className)} style={[{ height: size }, style]}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={async () => {
          await TrackPlayer.skipToPrevious();
        }}
      >
        <FontAwesome6
          name="backward"
          size={size}
          color={Colors.dark.foreground}
        />
      </TouchableOpacity>
    </View>
  );
};
