import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/ui";
import { Colors } from "@/constants";
import { fetchAllFilesByFolderId, fetchFolderByFolderId } from "@/lib/db/query";
import { Folder, Track } from "@/types/database";
import { AntDesign, Entypo, FontAwesome } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useNavigation } from "expo-router";
import * as React from "react";
import { FlatList, ScrollView, StyleSheet, View } from "react-native";
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
      <ThemedView className="px-8">
        <FlatList
          data={allFiles}
          renderItem={({ item, index }) => (
            <ThemedView
              key={item.id}
              className="flex flex-row items-center justify-between p-3 space-x-4 bg-slate-800 rounded-xl"
            >
              <ThemedView className="flex items-center justify-center w-10 h-10 p-2 rounded-full">
                <FontAwesome
                  name="play"
                  size={16}
                  color={Colors.dark.primary}
                />
              </ThemedView>

              <ThemedView className="bg-transparent">
                <ThemedView className="flex flex-row items-center space-x-1 bg-transparent">
                  <ThemedText>{index + 1}.</ThemedText>
                  <ThemedText> {item.name}</ThemedText>
                </ThemedView>
                <ThemedText className="mt-1 text-sm text-slate-400">
                  03:40
                </ThemedText>
              </ThemedView>

              <ThemedView className="bg-transparent">
                <Entypo
                  name="dots-three-vertical"
                  size={24}
                  color={"#dfdbdb"}
                />
              </ThemedView>
            </ThemedView>
          )}
          ItemSeparatorComponent={() => <ThemedView className="h-[1px] my-1" />}
        />
      </ThemedView>
    );
  };

  return (
    <ScrollView>
      <ThemedView className="w-screen h-screen" style={styles.container}>
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
                color={Colors.dark.primary}
              />
            </ThemedView>
          </TouchableOpacity>
        </ThemedView>

        {/* Audio Files */}
        {renderAudioFiles()}
      </ThemedView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark.background,
  },
  playButton: {
    backgroundColor: Colors.dark.muted,
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
