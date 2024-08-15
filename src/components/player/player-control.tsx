import { colors, Colors } from "@/constants";
import { cn, formateDurationInText, formatTime } from "@/lib/utils";
import { utilsStyles } from "@/styles";
import { FontAwesome, FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import * as React from "react";
import { View, ViewStyle } from "react-native";
import { Slider } from "react-native-awesome-slider";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useSharedValue } from "react-native-reanimated";
import { ThemedText } from "../ThemedText";
import { useMusicPlayer } from "@/hooks/useMusicPlayer";
import { useMusicStore } from "@/store/playerStore";
import TrackPlayer, {
  PlaybackState,
  State,
  Track,
  useActiveTrack,
  usePlaybackState,
  useProgress,
} from "react-native-track-player";
import { usePlaylistStore } from "@/store";

interface PlayerControlProps {
  style?: ViewStyle;
  className?: string;
}

interface PlayerControlButtonProps {
  size?: number;
  style?: ViewStyle;
  className?: string;
}

export const PlayerControls = ({
  style,
  className,
  ...rest
}: PlayerControlProps) => {
  const [queue, setQueue] = React.useState<Track[] | null>(null);

  // Side Effects
  React.useEffect(() => {
    (async () => {
      const queue = await TrackPlayer.getQueue();
      setQueue(queue);
    })();
  }, []);

  return (
    <View>
      {/* Progress Bar */}
      <View>
        <PlayerProgressBar />
      </View>

      {/* Controllers */}
      <View className="flex flex-row items-center mx-auto my-8 space-x-8">
        {/* Skip to Previous Button */}
        {queue && queue.length > 1 && <SkipToPreviousButton size={30} />}

        {/* Seek to 30s Backward */}
        <SeekTo30SBackward size={40} />

        {/* Play/Pause Button */}
        <PlayPauseButton size={50} />

        {/* Seek to 30s Forward */}
        <SeekTo30Forward size={40} />

        {/* Skip to Next Button */}
        {queue && queue.length > 1 && <SkipToNextButton size={30} />}
      </View>
    </View>
  );
};

export const PlayPauseButton = ({
  size = 28,
  style,
  className,
}: PlayerControlButtonProps) => {
  const { state } = usePlaybackState();

  return (
    <View style={[style]} className={cn("", className)}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={
          state === State.Playing
            ? async () => {
                await TrackPlayer.pause();
              }
            : async () => {
                await TrackPlayer.play();
              }
        }
      >
        <FontAwesome
          name={state === State.Playing ? "pause" : "play"}
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
    <View className={cn(className)} style={[style]}>
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
    <View className={cn(className)} style={[style]}>
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

export const SeekTo30SBackward = ({
  style,
  className,
  size = 30,
}: {
  style?: ViewStyle;
  className?: string;
  size?: number;
}) => {
  return (
    <View className={cn(className)} style={[style]}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={async () => {
          await TrackPlayer.seekBy(-30);
        }}
      >
        <MaterialIcons
          name="replay-30"
          size={size}
          color={Colors.dark.foreground}
        />
      </TouchableOpacity>
    </View>
  );
};

export const SeekTo30Forward = ({
  style,
  className,
  size = 30,
}: {
  style?: ViewStyle;
  className?: string;
  size?: number;
}) => {
  return (
    <View className={cn(className)} style={[style]}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={async () => {
          await TrackPlayer.seekBy(30);
        }}
      >
        <MaterialIcons
          name="forward-30"
          size={size}
          color={Colors.dark.foreground}
        />
      </TouchableOpacity>
    </View>
  );
};

export const PlayerProgressBar = ({ style }: { style?: ViewStyle }) => {
  const { duration, position } = useProgress(250);

  // Store
  const { playbackSpeed } = usePlaylistStore();

  const isSliding = useSharedValue(false);
  const progress = useSharedValue(0);
  const min = useSharedValue(0);
  const max = useSharedValue(1);

  const trackElapsedTime = formatTime(position);
  const trackRemainingTime = formatTime(duration - position);

  // Side Effects
  if (!isSliding.value) {
    progress.value = duration > 0 ? position / duration : 0;
  }

  return (
    <View style={[style]}>
      <View className="mt-8">
        <Slider
          progress={progress}
          minimumValue={min}
          maximumValue={max}
          containerStyle={utilsStyles.slider}
          thumbWidth={0}
          renderBubble={() => null}
          theme={{
            maximumTrackTintColor: colors.maximumTrackTintColor,
            minimumTrackTintColor: colors.minimumTrackTintColor,
          }}
          onSlidingStart={() => (isSliding.value = true)}
          onValueChange={async (value) => {
            await TrackPlayer.seekTo(value * duration);
          }}
          onSlidingComplete={async (value) => {
            if (!isSliding.value) return;

            isSliding.value = false;
            await TrackPlayer.seekTo(value * duration);
          }}
        />
      </View>

      {/* Times */}
      <View className="flex flex-row items-center justify-between mt-3">
        <ThemedText>{trackElapsedTime}</ThemedText>
        <ThemedText
          className="p-1 px-2 text-sm rounded-full"
          style={{
            backgroundColor: Colors.dark.muted,
            color: Colors.dark.text,
          }}
        >
          {duration > 0 ? formateDurationInText(duration) : ""} ({playbackSpeed}
          x)
        </ThemedText>
        <ThemedText>
          {"-"} {trackRemainingTime}
        </ThemedText>
      </View>
    </View>
  );
};
