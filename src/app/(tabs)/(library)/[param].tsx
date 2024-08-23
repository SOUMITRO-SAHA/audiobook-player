import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Asset } from "expo-media-library";
import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import * as React from "react";
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  StyleSheet,
  ToastAndroid,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import musicDefaultImage from "@/assets/images/music-note.png";
import {
  ThemedButton,
  ThemedScreen,
  ThemedText,
  ThemedView,
} from "@/components";
import { FastImageComponent } from "@/components/image";
import { TrackList } from "@/components/track";
import { Colors } from "@/constants";
import { db } from "@/lib/db";
import { playlist } from "@/lib/db/schema";
import { fetchBookInfo, getBookInfo } from "@/lib/services/fetch-book-info";
import { getFolderContentByFolderName } from "@/lib/services/media-library";
import { addTracks } from "@/lib/services/track-player-helper";
import { cn, extractLocalUrl } from "@/lib/utils";
import { usePlaylistStore } from "@/store";
import { eq } from "drizzle-orm";

const LibraryContentScreen = () => {
  const { name } = useLocalSearchParams();
  const navigation = useNavigation();

  // States
  const [initialLoading, setInitialLoading] = React.useState<boolean>(true);
  const [allFiles, setAllFiles] = React.useState<Asset[] | null>(null);
  const [resetMainCoverImage, setMainResetCoverImage] =
    React.useState<boolean>(false);

  // Store
  const {
    allBooksInfo,
    coverImage,
    currentlySelectedBooksInfo,

    setCoverImage,
    setPlaylistName,
    resetPlaylistName,
    resetCoverImage,
    setAllBooksInfo,
    setCurrentlySelectedBooksInfo,
  } = usePlaylistStore();

  // Function
  const handleRefreshContent = React.useCallback(async () => {
    if (name && typeof name === "string") {
      try {
        let coverImageUrl;
        const tracks = await getFolderContentByFolderName(name);

        // Setting the Folders
        if (tracks && tracks.audios) {
          setAllFiles(tracks.audios);
        }

        // Setting the CoverImages
        if (tracks && tracks.images && tracks.images.length > 0) {
          // Setting the First Image as Cover Image
          const firstImage = tracks.images[0];
          if (firstImage) {
            coverImageUrl = extractLocalUrl(firstImage.uri);
            if (coverImageUrl) {
              setCoverImage(coverImageUrl);
            }
          }
        } else if (tracks && tracks.images && tracks.images.length === 0) {
          setMainResetCoverImage(true); // This option only visible for Database/online resources

          const playlistName = name as string;

          // First Check in the Database for the Image:
          const existingCoverImage = await db.query.playlist.findFirst({
            where: eq(playlist.name, playlistName),
          });

          if (existingCoverImage && existingCoverImage.coverImage) {
            setCoverImage(existingCoverImage.coverImage);
          } else {
            // Fetch the book metadata for the google books
            const bookInfoFromGoogleBooks = await fetchBookInfo(name as string);

            if (bookInfoFromGoogleBooks) {
              coverImageUrl = bookInfoFromGoogleBooks?.coverImage;

              if (coverImageUrl) {
                setCoverImage(coverImageUrl);

                // Also update this into the Database
                const upsertPlaylistInfo = await db
                  .insert(playlist)
                  .values({
                    name: playlistName,
                    coverImage: coverImageUrl,
                  })
                  .onConflictDoUpdate({
                    target: playlist.name,
                    set: {
                      coverImage: coverImageUrl,
                    },
                  });
              }
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

  const handleResetMainCoverImage = () => {
    try {
      Alert.alert(
        "Change the Cover Image",
        "Are you sure you want to change this cover image?",
        [
          {
            text: "Cancel",
            onPress: () => null,
            style: "cancel",
          },
          {
            text: "YES",
            onPress: async () => {
              const playlistName = name as string;
              let bookInfo;

              // First Check whether book info already present in the global store
              if (allBooksInfo && allBooksInfo.length > 0) {
                bookInfo = allBooksInfo;
              } else {
                bookInfo = await getBookInfo(playlistName);

                if (bookInfo) {
                  // Before Directly Assign BookInfo first filter the books info
                  const filteredBookInfo = bookInfo.filter((info) =>
                    info.title.includes(playlistName)
                  );

                  if (filteredBookInfo) {
                    setAllBooksInfo(bookInfo);
                  } else {
                    Alert.alert("Message", "No relevant book info found.");
                    setMainResetCoverImage(false);
                    return;
                  }
                }
              }

              // First Setting the cover Image Data in the Global Store for multiple time changing the cover image
              if (bookInfo && bookInfo.length > 0) {
                // Now Just update the cover Image in sequential order
                if (currentlySelectedBooksInfo >= bookInfo.length)
                  setCurrentlySelectedBooksInfo(0);

                const currentBookInfo = bookInfo[currentlySelectedBooksInfo];
                if (currentBookInfo)
                  setCurrentlySelectedBooksInfo(currentlySelectedBooksInfo + 1);

                // Update the cover Image
                setCoverImage(currentBookInfo.coverImage);

                // Update in the Database
                await db.update(playlist).set({
                  coverImage: currentBookInfo.coverImage,
                });
              }
            },
          },
        ]
      );
    } catch (error) {}
  };

  const handleAddingPlaylist = React.useCallback(async () => {
    // First check whether the track is already playing or not
    // If already playing the current playlist then just play-pause the music

    // If not playing then create a new track
    // Now adding all files to the playlist
    if (allFiles && allFiles.length > 0) {
      // Adding all the files to the playlist and play when ready
      addTracks({ assets: allFiles });
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

  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        resetCoverImage();
        resetPlaylistName();

        navigation.goBack();
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return () => backHandler.remove();
    }, [])
  );

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
              backgroundColor: Colors.dark.background,
            }}
          >
            {resetMainCoverImage && (
              <ThemedButton
                className="bg-black/20"
                onPress={handleResetMainCoverImage}
                variant="ghost"
                size="sm"
                style={{
                  position: "absolute",
                  top: 2,
                  right: 20,
                  zIndex: 10,
                }}
              >
                <Ionicons name="reload" size={24} color={Colors.dark.text} />
              </ThemedButton>
            )}
            <FastImageComponent
              source={coverImage || musicDefaultImage}
              style={[
                styles.coverImage,
                !coverImage && {
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
              id={name as string}
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
