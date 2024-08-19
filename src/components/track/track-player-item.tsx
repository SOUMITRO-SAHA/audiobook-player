import { Entypo, FontAwesome } from "@expo/vector-icons";
import { Asset } from "expo-media-library";
import * as React from "react";
import { TouchableHighlight } from "react-native";
import TrackPlayer, {
  State,
  useActiveTrack,
  usePlaybackState,
} from "react-native-track-player";

import { ThemedText, ThemedView } from "@/components";
import { MovingText } from "@/components/player";
import { Colors } from "@/constants";
import { addSingleTrack } from "@/lib/services/track-player-helper";
import { formatTime } from "@/lib/utils";

export const TrackListItem = ({
  track,
  index,
  handleTrackSelect,
}: {
  track: Asset;
  index?: number;
  handleTrackSelect?: (track: Asset) => void;
}) => {
  const isActiveTrack = useActiveTrack()?.url === track.uri;
  const { state } = usePlaybackState();
  const activeTrack = useActiveTrack();

  const handleTrackListItemPress = async (item: Asset) => {
    // First Checking whether there is any active track
    if (activeTrack && activeTrack?.url === track.uri) {
      if (state && state === State.Playing) {
        await TrackPlayer.pause();
      } else {
        await TrackPlayer.play();
      }
    } else {
      addSingleTrack({ asset: item });
    }
  };

  // Track Name
  const trackName = React.useMemo(() => {
    let name = "";

    if (index) {
      name += index;
      name += ". ";
    }
    name += track.filename;
    return name;
  }, [track]);

  return (
    <TouchableHighlight
      key={track.id}
      onPress={
        handleTrackSelect
          ? () => handleTrackSelect(track)
          : () => handleTrackListItemPress(track)
      }
    >
      <ThemedView className="flex flex-row items-center justify-between p-3 space-x-4 bg-slate-800 rounded-xl">
        <ThemedView className="flex items-center justify-center w-10 h-10 p-2 rounded-full">
          <FontAwesome
            name={
              isActiveTrack && state && state === State.Playing
                ? "pause"
                : "play"
            }
            size={16}
            color={Colors.dark.primary}
          />
        </ThemedView>

        <ThemedView className="bg-transparent">
          <ThemedView className="flex flex-row items-center space-x-1 overflow-hidden bg-transparent">
            <MovingText text={trackName} animationThreshold={30} />
          </ThemedView>
          <ThemedText className="mt-1 text-sm text-slate-400">
            {track.duration ? formatTime(Number(track.duration)) : ""}
          </ThemedText>
        </ThemedView>

        <ThemedView className="bg-transparent">
          <Entypo name="dots-three-vertical" size={24} color={"#dfdbdb"} />
        </ThemedView>
      </ThemedView>
    </TouchableHighlight>
  );
};
