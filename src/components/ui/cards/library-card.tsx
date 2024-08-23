import { getRandomGradient } from "@/components/gradients";
import { FastImageComponent } from "@/components/image";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants";
import { db } from "@/lib/db";
import { playlist } from "@/lib/db/schema";
import { getBookInfo } from "@/lib/services/fetch-book-info";
import { extractName } from "@/lib/utils";
import { Entypo } from "@expo/vector-icons";
import { eq, InferSelectModel } from "drizzle-orm";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, TouchableOpacity } from "react-native";
import type { ReadDirItem } from "react-native-fs";

interface LibraryProps extends ReadDirItem {
  onPressThreeDots: (name: string) => void;
}

export const LibraryCard: React.FC<LibraryProps> = (props) => {
  const [playlistItem, setPlaylistItem] = useState<InferSelectModel<
    typeof playlist
  > | null>(null);
  // Memoization
  const color = useMemo(() => getRandomGradient(), []);

  // Side Effect
  React.useEffect(() => {
    const getThePlaylist = async () => {
      const existingPlaylist = await db.query.playlist.findFirst({
        where: eq(playlist.name, props.name),
      });

      if (existingPlaylist) {
        setPlaylistItem(existingPlaylist);
      }
    };

    const timeId = setTimeout(getThePlaylist, 100);
    return () => clearTimeout(timeId);
  }, []);

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
        {playlistItem ? (
          <FastImageComponent
            source={playlistItem?.coverImage || ""}
            style={styles.gradient}
          />
        ) : (
          <LinearGradient colors={color} style={styles.gradient} />
        )}
        <ThemedText className="text-gray-400 w-[88%]">{props.name}</ThemedText>
      </ThemedView>

      <Pressable
        className="W-[10%]"
        onPress={() => {
          props.onPressThreeDots("");
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
