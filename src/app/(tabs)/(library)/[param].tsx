import musicDefaultImage from "@/assets/images/music-note.png";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { TrackList } from "@/components/track";
import { Colors } from "@/constants";
// import { getFolderContentByFolderName } from "@/lib/services/fs-worker";
import { usePlaylistStore } from "@/store";
import { AntDesign } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Asset } from "expo-media-library";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import * as React from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

const LibraryContentScreen = () => {
  const { name } = useLocalSearchParams();
  const navigation = useNavigation();

  // States
  const [initialLoading, setInitialLoading] = React.useState<boolean>(true);
  const [allFiles, setAllFiles] = React.useState<Asset[] | null>(null);
  const [coverImages, setCoverImages] = React.useState<Asset[] | null>(null);

  // Store
  const { setCoverImage, setPlaylistName } = usePlaylistStore();

  // Router
  const router = useRouter();

  // Function
  const handleRefreshContent = React.useCallback(async () => {
    if (name && typeof name === "string") {
      try {
        const tracks = null; // await getFolderContentByFolderName(name);

        // Setting the Folders
        // if (tracks && tracks.audios) {
        //   setAllFiles(tracks.audios);
        // }

        // // Setting the CoverImages
        // if (tracks && tracks.images) {
        //   setCoverImages(tracks.images);

        //   // Setting the First Image as Cover Image
        //   const firstImage = tracks.images[0];
        //   setCoverImage(firstImage.uri);
        // }
      } catch (error) {
        console.error(error);
      } finally {
        setInitialLoading(false);
      }
    }
  }, [name, initialLoading]);

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
    handleRefreshContent();
  }, [name, initialLoading]);

  if (initialLoading) {
    return (
      <ParallaxScrollView>
        <ThemedView className="flex items-center justify-center w-full h-full">
          <ActivityIndicator size={50} color={Colors.dark.primary} />
        </ThemedView>
      </ParallaxScrollView>
    );
  }

  return (
    <ParallaxScrollView>
      {allFiles && allFiles.length > 0 ? (
        <ThemedView style={styles.container}>
          <ThemedView
            className="p-3 mx-auto mb-6 bg-transparent rounded-xl"
            style={{
              backgroundColor: Colors.dark.primary,
            }}
          >
            <Image source={musicDefaultImage} style={styles.coverImage} />

            <TouchableOpacity className="absolute -bottom-8 left-1/2">
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
    </ParallaxScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark.background,
    paddingBottom: 50,
  },
  playButton: {
    backgroundColor: Colors.light.destructive,
    transform: [{ translateX: -33 }],
  },
  coverImage: {
    width: 200,
    height: 200,
    marginTop: 20,
    resizeMode: "contain",
    borderRadius: 10,
    position: "relative",
    overflow: "hidden",
  },
});

export default LibraryContentScreen;
