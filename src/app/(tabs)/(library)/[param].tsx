import { AntDesign } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Asset } from "expo-media-library";
import { useLocalSearchParams, useNavigation } from "expo-router";
import * as React from "react";
import { ActivityIndicator, StyleSheet, ToastAndroid } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import musicDefaultImage from "@/assets/images/music-note.png";
import { ThemedScreen } from "@/components";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { TrackList } from "@/components/track";
import { Colors } from "@/constants";
import { getFolderContentByFolderName } from "@/lib/services/media-library";
import { addTracks } from "@/lib/services/track-player-service";
import { cn, extractLocalUrl } from "@/lib/utils";
import { usePlaylistStore } from "@/store";

const LibraryContentScreen = () => {
  const { name } = useLocalSearchParams();
  const navigation = useNavigation();

  // States
  const [initialLoading, setInitialLoading] = React.useState<boolean>(true);
  const [allFiles, setAllFiles] = React.useState<Asset[] | null>(null);

  // Store
  const { setCoverImage, coverImage, setPlaylistName } = usePlaylistStore();

  // Function
  const handleRefreshContent = React.useCallback(async () => {
    if (name && typeof name === "string") {
      try {
        const tracks = await getFolderContentByFolderName(name);

        // Setting the Folders
        if (tracks && tracks.audios) {
          setAllFiles(tracks.audios);
        }

        // Setting the CoverImages
        if (tracks && tracks.images) {
          // Setting the First Image as Cover Image
          const firstImage = tracks.images[0];
          if (firstImage) {
            const uri = extractLocalUrl(firstImage.uri);
            if (uri) {
              setCoverImage(uri);
            }
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setInitialLoading(false);
      }
    } else {
      setInitialLoading(false);
    }
  }, [name, initialLoading]);

  const handleAddingPlaylist = React.useCallback(async () => {
    // Now adding all files to the playlist
    if (allFiles && allFiles.length > 0) {
      addTracks(allFiles);
      return;
    } else {
      ToastAndroid.show("Playlist is empty", ToastAndroid.SHORT);
      return;
    }
  }, [allFiles]);

  // Side Effects
  React.useEffect(() => {
    if (name) {
      navigation.setOptions({ title: name });
    }

    // Setting the Playlist Name
    if (name && typeof name === "string") {
      setPlaylistName(name);
    }
  }, [name, navigation]);

  React.useEffect(() => {
    const timeout = setTimeout(handleRefreshContent, 1000);
    return () => clearTimeout(timeout);
  }, [name, initialLoading]);

  if (initialLoading) {
    return (
      <ThemedScreen>
        <ThemedView className="flex items-center justify-center w-full h-full">
          <ActivityIndicator size={50} color={Colors.dark.primary} />
        </ThemedView>
      </ThemedScreen>
    );
  }

  return (
    <ThemedScreen
      style={{
        marginTop: 0,
      }}
    >
      {allFiles && allFiles.length > 0 ? (
        <ThemedView style={[styles.container]}>
          <ThemedView
            className={cn("mx-auto mb-8 rounded-xl", coverImage ? "" : "p-3")}
            style={{
              backgroundColor: Colors.dark.primary,
            }}
          >
            <Image
              source={coverImage ?? musicDefaultImage}
              style={[
                styles.coverImage,
                coverImage
                  ? {
                      resizeMode: "cover",
                    }
                  : {
                      resizeMode: "contain",
                      marginTop: 20,
                    },
              ]}
            />

            <TouchableOpacity
              className="absolute -bottom-8 left-1/2"
              onPress={handleAddingPlaylist}
            >
              <ThemedView
                style={styles.playButton}
                className="flex flex-row items-center justify-center w-16 h-16 space-x-3 border-4 rounded-full shadow"
              >
                <AntDesign
                  name="caretright"
                  size={25}
                  color={Colors.dark.background}
                />
              </ThemedView>
            </TouchableOpacity>
          </ThemedView>

          {/* Audio Files */}

          {allFiles && (
            <TrackList
              trackList={allFiles}
              refreshing={initialLoading}
              handleRefresh={() => {
                setInitialLoading((prev) => !prev);
              }}
            />
          )}
        </ThemedView>
      ) : (
        <ThemedView className="flex flex-row items-center justify-center w-full h-full">
          <ThemedView
            className="p-2 w-[80%] h-20 flex justify-center items-center rounded-xl"
            style={{ backgroundColor: Colors.dark.muted }}
          >
            <ThemedText className="text-center text-slate-300">
              No Content Found!!!
            </ThemedText>
          </ThemedView>
        </ThemedView>
      )}
    </ThemedScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark.background,
    paddingBottom: 80,
  },
  playButton: {
    backgroundColor: Colors.light.destructive,
    transform: [{ translateX: -33 }],
  },
  coverImage: {
    borderRadius: 10,
    width: 200,
    height: 250,
    position: "relative",
    overflow: "hidden",
  },
});

export default LibraryContentScreen;
