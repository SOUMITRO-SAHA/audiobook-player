import { Colors } from "@/constants";
import { addSingleTrack, generateSingleTrack } from "@/lib/services/tracks";
import { formatTime } from "@/lib/utils";
import { usePlaylistStore } from "@/store";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import { Asset } from "expo-media-library";
import { useRouter } from "expo-router";
import { TouchableHighlight } from "react-native";
import { useActiveTrack } from "react-native-track-player";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

export const TrackListItem = ({
  track,
  index,
}: {
  track: Asset;
  index: number;
}) => {
  const isActiveTrack = useActiveTrack()?.url === track.uri;

  // Store
  const { playlistName, coverImage } = usePlaylistStore();

  // Router
  const router = useRouter();

  const handleTrackListItemPress = async (item: Asset) => {
    // First, Format the Current Audio Suitable for React Native Track Player

    const track = generateSingleTrack({
      track: item,
      albumName: playlistName,
      coverImage: coverImage,
    });

    // then Add to the Track Player and also play
    await addSingleTrack(track);

    // Last navigate to the player screen
    router.navigate({
      pathname: "player",
    });
  };

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
          <ThemedView className="flex flex-row items-center space-x-1 bg-transparent">
            <ThemedText>{index + 1}.</ThemedText>
            <ThemedText> {track.filename}</ThemedText>
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
