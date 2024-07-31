import { getRandomGradient } from "@/components/gradients";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants";
import { Folder } from "@/types/database";
import { Entypo } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useMemo } from "react";
import { Pressable, StyleSheet, TouchableOpacity } from "react-native";

interface LibraryProps extends Folder {
  onPressThreeDots: (value: number) => void;
}

export const LibraryCard: React.FC<LibraryProps> = (props) => {
  // Memoization
  const color = useMemo(() => getRandomGradient(), []);

  // <Link href={`/contents/${props.id}`}>
  return (
    <TouchableOpacity
      style={styles.container}
      className="flex flex-row items-center justify-between w-full p-2 px-3 space-x-3 bg-red-500 rounded-lg shadow-xl"
      onPress={() => {
        router.push({
          pathname: `[id]`,
          params: { id: props.id },
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
          props.onPressThreeDots(props.id);
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
