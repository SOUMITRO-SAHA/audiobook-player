import { Entypo, FontAwesome } from "@expo/vector-icons";
import { Asset } from "expo-media-library";
import { TouchableHighlight } from "react-native";

import { Colors } from "@/constants";
import { formatTime } from "@/lib/utils";
import { Track, useMusicStore } from "@/store/playerStore";
import * as React from "react";
import { MovingText } from "../player";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

export const TrackListItem = ({
  track,
  index,
}: {
  track: Asset;
  index?: number;
}) => {
  // Store
  const { currentTrack, setCurrentTrack, setCurrentPlaylistIndex } =
    useMusicStore();

  const isActiveTrack = currentTrack?.uri === track.uri;

  const handleTrackListItemPress = async (item: Asset) => {
    if (index) {
      setCurrentPlaylistIndex(index);
    } else {
      const formattedTrack: Track = {
        uri: item.uri,
        id: item.id,
        title: item.filename,
      };
      setCurrentTrack(formattedTrack);
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
      onPress={() => handleTrackListItemPress(track)}
    >
      <ThemedView className="flex flex-row items-center justify-between p-3 space-x-4 bg-slate-800 rounded-xl">
        <ThemedView className="flex items-center justify-center w-10 h-10 p-2 rounded-full">
          <FontAwesome
            name={isActiveTrack ? "pause" : "play"}
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
