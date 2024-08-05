import * as React from "react";
import { ThemedText } from "../ThemedText";
import { View } from "react-native";
import TrackPlayer from "react-native-track-player";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "@/constants";
import { TouchableHighlight } from "react-native-gesture-handler";
import { TouchableOpacity } from "@gorhom/bottom-sheet";

const PlayerFeatures = () => {
  const [currentRate, setCurrentRate] = React.useState(1);

  // Side Effects
  React.useEffect(() => {
    (async () => {
      const rate = await TrackPlayer.getRate();
      if (rate) {
        setCurrentRate(rate);
      }
    })();
  }, []);

  return (
    <View className="flex flex-row mt-6 -mb-8 justify-evenly">
      <TouchableOpacity activeOpacity={0.8}>
        <View className="items-center justify-center w-20 h-16 p-3 shadow rounded-xl bg-black/50">
          <ThemedText>{currentRate}</ThemedText>
          <ThemedText>Speed</ThemedText>
        </View>
      </TouchableOpacity>

      <TouchableOpacity activeOpacity={0.8}>
        <View className="flex items-center justify-center w-20 h-16 p-3 shadow rounded-xl bg-black/50">
          <MaterialCommunityIcons
            name="timer-outline"
            size={24}
            color={Colors.dark.foreground}
          />
          <ThemedText>Timer</ThemedText>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default PlayerFeatures;
