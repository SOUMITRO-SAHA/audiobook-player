import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedView } from "@/components/ThemedView";
import { TrackListItem } from "@/components/track";
import { Colors } from "@/constants";
import { fetchAllFilesByFolderId, fetchFolderByFolderId } from "@/lib/db/query";
import { Folder, Track } from "@/types/database";
import { AntDesign } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useNavigation } from "expo-router";
import * as React from "react";
import { FlatList, ScrollView, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

const LibraryContentScreen = () => {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();

  const [folderInfo, setFolderInfo] = React.useState<Folder | null>(null);
  const [allFiles, setAllFiles] = React.useState<Track[] | null>(null);

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

  const renderAudioFiles = () => {
    return (
      <ThemedView>
        <FlatList
          data={allFiles}
          renderItem={({ item, index }) => (
            <TrackListItem track={item} index={index} />
          )}
          ItemSeparatorComponent={() => <ThemedView className="h-[1px] my-1" />}
        />
      </ThemedView>
    );
  };

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
          {renderAudioFiles()}
        </ThemedView>
      </ScrollView>
    </ParallaxScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark.background,
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
