import { getRandomGradient } from "@/components/gradients";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Folder } from "@/types/database";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo } from "react";
import { StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants";
import { Link } from "expo-router";

interface LibraryProps extends Folder {}

export const LibraryCard: React.FC<LibraryProps> = (props) => {
  // Memoization
  const color = useMemo(() => getRandomGradient(), []);

  return (
    <ThemedView
      className="flex flex-row items-center justify-between grid-cols-12 p-2 px-4 space-x-3 rounded-lg shadow-xl"
      style={{ backgroundColor: Colors.dark.muted }}
    >
      <ThemedView className="flex flex-row items-center space-x-3 bg-transparent w-[90%]">
        <LinearGradient colors={color} style={styles.gradient} />
        <ThemedText className="text-gray-400">{props.name}</ThemedText>
      </ThemedView>

      <Link href={`/contents/${props.id}`}>
        <ThemedView className="bg-transparent">
          <MaterialIcons
            name="arrow-forward-ios"
            size={24}
            color={Colors.dark.mutedForeground}
          />
        </ThemedView>
      </Link>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  gradient: {
    height: 40,
    width: 40,
    borderRadius: 5,
  },
});
