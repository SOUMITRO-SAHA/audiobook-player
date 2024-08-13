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
  return (
    <View>
      {/* Progress Bar */}
      <View>
        <PlayerProgressBar />
      </View>

      {/* Controllers */}
      <View className="flex flex-row items-center mx-auto my-8 space-x-8">
        {/* Skip to Previous Button */}
        <SkipToPreviousButton size={30} />

        {/* Seek to 30s Backward */}
        <SeekTo30SBackward size={40} />

        {/* Play/Pause Button */}
        <PlayPauseButton size={50} />

        {/* Seek to 30s Forward */}
        <SeekTo30Forward size={40} />

        {/* Skip to Next Button */}
        <SkipToNextButton size={30} />
      </View>
    </View>
  );
};

export const PlayPauseButton = ({
  size = 28,
  style,
  className,
}: PlayerControlButtonProps) => {
  const { isPlaying, pauseMusic, playMusic } = useMusicStore();

  console.log("In Side PlayPause Controller ===>", isPlaying);

  return (
    <View style={[style]} className={cn("", className)}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={
          isPlaying
            ? async () => {
                pauseMusic();
              }
            : async () => {
                playMusic();
              }
        }
      >
        <FontAwesome
          name={true ? "pause" : "play"}
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
          // await TrackPlayer.skipToNext();
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
          // TODO:
          // await TrackPlayer.skipToPrevious();
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
  //TODO: const { position } = useProgress();

  return (
    <View className={cn(className)} style={[style]}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={async () => {
          // TODO:
          // await TrackPlayer.seekBy(position - 30);
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
  // const { position } = useProgress();

  return (
    <View className={cn(className)} style={[style]}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={async () => {
          // await TrackPlayer.seekBy(position + 30);
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
  // const { duration, position } = useProgress(250);
  const { duration, position } = { duration: 40000, position: 2044 };
  const [currentTrackSpeed, setCurrentTrackSpeed] = React.useState(1);

  const isSliding = useSharedValue(false);
  const progress = useSharedValue(0);
  const min = useSharedValue(0);
  const max = useSharedValue(0);

  const trackElapsedTime = formatTime(position);
  const trackRemainingTime = formatTime(duration - position);
  const trackDuration = formatTime(duration);

  if (!isSliding.value) {
    progress.value = duration > 0 ? position / duration : 0;
  }

  // Side Effects
  React.useEffect(() => {
    (async () => {
      // const getTrackPlayerCurrentSpeed = await TrackPlayer.getRate();
      // if (getTrackPlayerCurrentSpeed) {
      // setCurrentTrackSpeed(getTrackPlayerCurrentSpeed);
      // }
    })();
  }, []);

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
          onSlidingStart={() => (isSliding.value = true)}
          theme={{
            maximumTrackTintColor: colors.maximumTrackTintColor,
            minimumTrackTintColor: colors.minimumTrackTintColor,
          }}
          onValueChange={async (value) => {
            // await TrackPlayer.seekTo(value * duration);
          }}
          onSlidingComplete={async (value) => {
            if (!isSliding.value) return;
            isSliding.value = false;

            // await TrackPlayer.seekTo(value * duration);
          }}
        />
      </View>

      {/* Times */}
      <View className="flex flex-row items-center justify-between mt-3">
        <ThemedText>{trackElapsedTime}</ThemedText>
        <ThemedText className="text-xl text-slate-300">
          {Number(trackDuration) > 0
            ? formateDurationInText(Number(trackDuration))
            : ""}{" "}
          ({currentTrackSpeed}
          X)
        </ThemedText>
        <ThemedText>{trackRemainingTime}</ThemedText>
      </View>
    </View>
  );
};
