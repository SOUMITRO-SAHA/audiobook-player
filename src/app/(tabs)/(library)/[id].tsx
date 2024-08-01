import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedView } from "@/components/ThemedView";
import { TrackList, TrackListItem } from "@/components/track";
import { Colors } from "@/constants";
import { fetchAllFilesByFolderId, fetchFolderByFolderId } from "@/lib/db/query";
import { Folder, Track } from "@/types/database";
import { AntDesign } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useNavigation } from "expo-router";
import * as React from "react";
import { FlatList, ScrollView, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Track as RNTrack } from "react-native-track-player";

const generateTracks = async (ts: Track[], f: Folder): Promise<RNTrack[]> => {
  try {
    const tracks: RNTrack[] = [];

    for (const t of ts) {
      const track: RNTrack = {
        title: t.name,
        url: t.uri,
        album: f.name,
        artist: "Unknown",
        duration: Number(t.duration),
        artwork: String(f.coverImage),
      };

      // Pushing to the tracks
      tracks.push(track);
    }

    return tracks;
  } catch (error) {
    console.error("Error generating tracks: ", error);
    return []; // Return an empty array in case of an error
  }
};

const LibraryContentScreen = () => {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();

  const [folderInfo, setFolderInfo] = React.useState<Folder | null>(null);
  const [allFiles, setAllFiles] = React.useState<Track[] | null>(null);
  const [trackList, setTrackList] = React.useState<RNTrack[]>([]);

  // Side Effects
  React.useEffect(() => {
    const getAllFilesByFolderId = async (folderId: string) => {
      try {
        const folder = await fetchFolderByFolderId(Number(folderId));

        if (folder) {
          setFolderInfo(folder);
        }

        const files = await fetchAllFilesByFolderId(Number(folderId));

        if (files) {
          const sortedArray = files.sort((a, b) => {
            return a.name.localeCompare(b.name);
          });
          setAllFiles(sortedArray);
        }
      } catch (error) {
        console.error("Error fetching folder:", error);
      }
    };

    if (typeof id === "string") {
      getAllFilesByFolderId(id);
    }
  }, [id]);

  React.useEffect(() => {
    if (folderInfo) {
      navigation.setOptions({ title: folderInfo.name });
    }
  }, [id, navigation, folderInfo]);

  React.useEffect(() => {
    const generatingTheTracks = async (ts: Track[], f: Folder) => {
      const tracks = await generateTracks(ts, f);

      // Now Setting the Local State
      if (tracks.length > 0) {
        setTrackList(tracks);
      }
    };

    if (folderInfo && allFiles) {
      const timeStamp = setTimeout(
        () => generatingTheTracks(allFiles, folderInfo),
        100
      );
      return () => clearTimeout(timeStamp);
    }
  }, [folderInfo, allFiles]);

  return (
    <ParallaxScrollView>
      <ScrollView>
        <ThemedView style={styles.container}>
          <ThemedView className="mx-auto mb-16 bg-transparent">
            <Image source={folderInfo?.coverImage} style={styles.coverImage} />

            <TouchableOpacity className="absolute -bottom-8 left-1/2">
              <ThemedView
                style={styles.playButton}
                className="flex flex-row items-center justify-center w-16 h-16 space-x-3 rounded-full"
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

          <TrackList trackList={trackList} />
        </ThemedView>
      </ScrollView>
    </ParallaxScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark.background,
    paddingBottom: 50,
  },
  playButton: {
    backgroundColor: Colors.dark.primary,
    transform: [{ translateX: -40 }],
  },
  coverImage: {
    width: 200,
    height: 300,
    marginTop: 20,
    resizeMode: "contain",
    borderRadius: 10,
    position: "relative",
    overflow: "hidden",
  },
});

export default LibraryContentScreen;
