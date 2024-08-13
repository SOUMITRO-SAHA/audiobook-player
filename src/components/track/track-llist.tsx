import { Asset } from "expo-media-library";
import React from "react";
import { FlatList } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { TrackListItem } from "./track-player-item";
import { useRouter } from "expo-router";

export const TrackList = ({
  trackList,
  refreshing = false,
  handleRefresh,
}: {
  refreshing: boolean;
  trackList: Asset[];
  handleRefresh: () => void;
}) => {
  // Functions

  return (
    <FlatList
      style={{
        height: 450,
      }}
      data={trackList}
      renderItem={({ item, index }) => (
        <TrackListItem track={item} index={index + 1} />
      )}
      ListFooterComponent={() => {
        if (trackList.length > 0) {
          return (
            <TouchableOpacity activeOpacity={0.7}>
              <ThemedView className="flex items-center justify-center p-3 mt-3 bg-slate-800/80 rounded-xl">
                <ThemedText className="text-gray-400">
                  End of the List
                </ThemedText>
              </ThemedView>
            </TouchableOpacity>
          );
        }
      }}
      ListEmptyComponent={() => (
        <ThemedView className="flex items-center justify-center p-3 py-6 mt-6 bg-slate-800/80 rounded-xl">
          <ThemedText className="mt-3 text-gray-400">
            No Tracks Found
          </ThemedText>
        </ThemedView>
      )}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => <ThemedView className="my-1" />}
      refreshing={refreshing}
      onRefresh={handleRefresh}
    />
  );
};
