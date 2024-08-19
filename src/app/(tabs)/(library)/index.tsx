import { Ionicons } from "@expo/vector-icons";
import { Asset } from "expo-media-library";
import * as React from "react";
import { ActivityIndicator, FlatList, TouchableOpacity } from "react-native";
import { ReadDirItem } from "react-native-fs";

import { ThemedScreen, ThemedText, ThemedView } from "@/components";
import { TrackListItem } from "@/components/track";
import { LibraryCard } from "@/components/ui";
import { Colors } from "@/constants";
import { readDefaultDirectory } from "@/lib/services/fs-worker";
import { cn } from "@/lib/utils";
import { useAppStore, usePlaylistStore } from "@/store";

export default function LibraryScreen() {
  const [refreshCount, setRefreshCount] = React.useState<number>(0);
  const [refreshing, setRefreshing] = React.useState<boolean>(false);

  const [files, setFiles] = React.useState<Asset[] | null>(null);
  const [folders, setFolders] = React.useState<ReadDirItem[] | null>(null);

  // Store
  const { isLibraryLoading, setLibraryLoading, resetLibraryLoading } =
    useAppStore();

  const { resetPlaylistName, resetCoverImage, coverImage, playlistName } =
    usePlaylistStore();

  const handleRefresh = async () => {
    try {
      // await addNewFolderToTheApplication();
      setRefreshing(true);

      const timestamp = setTimeout(() => {
        setRefreshing(false);
      }, 1000);
      return () => clearTimeout(timestamp);
    } catch (error) {
      console.error(`Library Content Reloading ===>`, error);
    }

    // Update `refreshCount`
    if (refreshCount >= 6) {
      setRefreshCount(0);
    } else {
      setRefreshCount((prev) => prev + 1);
    }
  };

  const handleThreeDotPress = (name: string) => {};

  // Side Effect
  React.useEffect(() => {
    (async () => {
      setLibraryLoading();
      try {
        const defaultDirectory = await readDefaultDirectory();

        if (defaultDirectory) {
          setFolders(defaultDirectory.directories);
          setFiles(defaultDirectory.files);
        }
      } catch (error) {
        console.error("Error reading default directory:", error);
      } finally {
        // Also Updating the Store
        resetCoverImage();
        resetPlaylistName();
        resetLibraryLoading();
      }
    })();
  }, [refreshing]);

  React.useEffect(() => {
    (() => {
      resetCoverImage();
      resetPlaylistName();
    })();
  }, []);

  // Render Components
  const renderLoadingCard = () => {
    return (
      <ThemedView
        className="p-4 rounded-xl"
        style={{ backgroundColor: Colors.dark.muted }}
      >
        <ActivityIndicator color={Colors.dark.primary} size={"large"} />
      </ThemedView>
    );
  };

  const renderLibraryCards = () => {
    return (
      <ThemedView>
        <FlatList
          data={
            folders && files
              ? [
                  ...folders.map((folder) => ({ ...folder, type: "folder" })),
                  ...files.map((file) => ({ ...file, type: "file" })),
                ]
              : []
          }
          renderItem={({ item }) => {
            if (item.type === "folder") {
              return (
                <LibraryCard
                  {...(item as ReadDirItem)}
                  onPressThreeDots={handleThreeDotPress}
                />
              );
            } else {
              return <TrackListItem track={item as Asset} />;
            }
          }}
          ItemSeparatorComponent={() => {
            return <ThemedView style={{ height: 5 }} />;
          }}
          ListEmptyComponent={() => (
            <ThemedView className="flex items-center justify-center p-3 py-6 mt-6 bg-slate-800/80 rounded-xl">
              <ThemedText className="mt-3 text-gray-400">
                No Content Found!!!
              </ThemedText>
              {refreshCount <= 3 ? (
                <>
                  <ThemedText className="my-3 text-xl text-center text-gray-400">
                    Press the "+" button down below to add a new folder to the
                    application
                  </ThemedText>
                </>
              ) : (
                <>
                  <ThemedText className="mt-4 text-center text-gray-500">
                    There might be no content available in the primary folder
                  </ThemedText>
                </>
              )}
            </ThemedView>
          )}
          ListFooterComponent={({ item }) => {
            if (item) {
              return (
                <ThemedText className="flex flex-row items-center justify-center w-full h-full mt-3 text-xs text-center text-gray-300">
                  End of the List
                </ThemedText>
              );
            } else {
              return null;
            }
          }}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      </ThemedView>
    );
  };

  return (
    <ThemedScreen>
      <ThemedView className={cn("flex-row justify-between items-center")}>
        <ThemedText type="title">Library</ThemedText>

        <TouchableOpacity onPress={handleRefresh}>
          <ThemedView
            className="w-10 h-10 p-2 rounded-lg"
            style={{
              backgroundColor: Colors.dark.muted,
            }}
          >
            <Ionicons
              name="reload-outline"
              size={24}
              color={Colors.dark.foreground}
            />
          </ThemedView>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView>{renderLibraryCards()}</ThemedView>

      {/* For Loading New Card */}
      <ThemedView>{isLibraryLoading && renderLoadingCard()}</ThemedView>
    </ThemedScreen>
  );
}
