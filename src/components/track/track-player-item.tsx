import { Colors } from "@/constants";
import { formatTime } from "@/lib/utils";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import { TouchableHighlight } from "react-native";
import { Track, useActiveTrack } from "react-native-track-player";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

export const TrackListItem = ({
  track,
  index,
  onTrackPress,
}: {
  track: Track;
  index: number;
  onTrackPress: (track: Track) => void;
}) => {
  const isActiveTrack = useActiveTrack()?.url === track.uri;
  console.log(`Is Active Track: ${isActiveTrack}`);

  return (
    <TouchableHighlight key={track.id} onPress={() => onTrackPress(track)}>
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
            <ThemedText> {track.title}</ThemedText>
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
