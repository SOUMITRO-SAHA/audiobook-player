import { Colors } from "@/constants";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomSheetModal, TouchableOpacity } from "@gorhom/bottom-sheet";
import * as React from "react";
import { View } from "react-native";
import { ThemedText } from "../ThemedText";
import { BottomSheet } from "../bottom-sheet";

const PlayerFeatures = () => {
  const [currentRate, setCurrentRate] = React.useState(1);
  const speedRef = React.useRef<BottomSheetModal>(null);
  const timerRef = React.useRef<BottomSheetModal>(null);

  // Side Effects

  return (
    <View className="flex flex-row mt-6 -mb-8 justify-evenly">
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          speedRef.current?.present();
        }}
      >
        <View className="items-center justify-center w-20 h-16 p-3 shadow rounded-xl bg-black/50">
          <ThemedText>{currentRate}</ThemedText>
          <ThemedText>Speed</ThemedText>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          timerRef.current?.present();
        }}
      >
        <View className="flex items-center justify-center w-20 h-16 p-3 shadow rounded-xl bg-black/50">
          <MaterialCommunityIcons
            name="timer-outline"
            size={24}
            color={Colors.dark.foreground}
          />
          <ThemedText>Timer</ThemedText>
        </View>
      </TouchableOpacity>

      {/* Bottom Sheet  */}
      <BottomSheet ref={speedRef}>
        <ThemedText>Speed Modal</ThemedText>
      </BottomSheet>

      <BottomSheet ref={timerRef}>
        <ThemedText>Timer Modal</ThemedText>
      </BottomSheet>
    </View>
  );
};

export default PlayerFeatures;
