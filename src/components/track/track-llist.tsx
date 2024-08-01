import React from "react";
import { FlatList } from "react-native";
import TrackPlayer, { Track } from "react-native-track-player";
import { TrackListItem } from "./track-player-item";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { TouchableOpacity } from "react-native-gesture-handler";

export const TrackList = ({ trackList }: { trackList: Track[] }) => {
  const handleTrackSelect = async (track: Track) => {
    try {
      await TrackPlayer.load(track);
      await TrackPlayer.play();
    } catch (error) {
      console.error("Something went wrong!!! ", error);
    }
  };

  return (
    <FlatList
      data={trackList}
      renderItem={({ item, index }) => (
        <TrackListItem
          track={item}
          index={index}
          onTrackPress={() => handleTrackSelect(item)}
        />
      )}
      ListFooterComponent={() => (
        <TouchableOpacity activeOpacity={0.7}>
          <ThemedView className="flex items-center justify-center p-3 mt-3 bg-slate-800/80 rounded-xl">
            <ThemedText className="text-gray-400">End of the List</ThemedText>
          </ThemedView>
        </TouchableOpacity>
      )}
      ListEmptyComponent={() => (
        <ThemedView className="flex items-center justify-center p-3 py-6 mt-6 bg-slate-800/80 rounded-xl">
          <ThemedText className="mt-3 text-gray-400">
            No Tracks Found
          </ThemedText>
        </ThemedView>
      )}
      ItemSeparatorComponent={() => <ThemedView className="my-1" />}
    />
  );
};
