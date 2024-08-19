import { Asset } from "expo-media-library";
import * as React from "react";
import { FlatList } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { ThemedText, ThemedView } from "@/components";
import { TrackListItem } from "./track-player-item";
import { useQueue } from "@/store/queue";
import TrackPlayer from "react-native-track-player";
import { addTracks } from "@/lib/services/track-player-helper";

type TrackListProps = {
  id: string;
  refreshing: boolean;
  trackList: Asset[];
  handleRefresh: () => void;
};

export const TrackList: React.FC<TrackListProps> = ({
  id,
  trackList,
  refreshing = false,
  handleRefresh,
  ...flatlistProps
}) => {
  const queueOffSet = React.useRef(0);
  const { activeQueueId, setActiveQueueId } = useQueue();

  const handleTrackSelect = async (selectedTrack: Asset) => {
    const trackIndex = trackList.findIndex(
      (track) => track.id === selectedTrack.id
    );

    if (trackIndex === -1) return;

    const beforeTracks = trackList.slice(0, trackIndex);
    const afterTracks = trackList.slice(trackIndex + 1);

    const updatedTracks = [selectedTrack, ...afterTracks, ...beforeTracks];

    // Now adding this track-object into the tracks
    await addTracks({ assets: updatedTracks });

    queueOffSet.current = trackIndex;
    setActiveQueueId(id);
  };

  return (
    <FlatList
      style={{
        height: 390,
      }}
      data={trackList}
      renderItem={({ item, index }) => (
        <TrackListItem
          track={item}
          index={index + 1}
          handleTrackSelect={handleTrackSelect}
        />
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
