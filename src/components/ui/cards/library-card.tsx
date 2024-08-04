import { getRandomGradient } from "@/components/gradients";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants";
import { Entypo } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useMemo } from "react";
import { Pressable, StyleSheet, TouchableOpacity } from "react-native";
import { ReadDirItem } from "react-native-fs";

interface LibraryProps extends ReadDirItem {
  onPressThreeDots: (name: string) => void;
}

export const LibraryCard: React.FC<LibraryProps> = (props) => {
  // Memoization
  const color = useMemo(() => getRandomGradient(), []);

  return (
    <TouchableOpacity
      style={styles.container}
      className="flex flex-row items-center justify-between w-full p-2 px-3 space-x-3 bg-red-500 rounded-lg shadow-xl"
      onPress={() => {
        router.push({
          pathname: `[param]`,
          params: { name: props.name },
        });
      }}
    >
      <ThemedView className="flex flex-row items-center space-x-3 w-[90%] bg-transparent">
        <LinearGradient colors={color} style={styles.gradient} />
        <ThemedText className="text-gray-400">{props.name}</ThemedText>
      </ThemedView>

      <Pressable
        className="W-[10%]"
        onPress={() => {
          props.onPressThreeDots(props.name);
        }}
      >
        <ThemedView className="bg-transparent">
          <Entypo
            name="dots-three-vertical"
            size={24}
            style={{
              color: "#a4b6ce",
            }}
          />
        </ThemedView>
      </Pressable>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark.muted,
  },
  gradient: {
    height: 40,
    width: 40,
    borderRadius: 5,
  },
});
