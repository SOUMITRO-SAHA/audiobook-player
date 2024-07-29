import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { fetchAllFilesByFolderId, fetchFolderByFolderId } from "@/lib/db/query";
import { Folder, Track } from "@/types/database";
import { useLocalSearchParams, useNavigation } from "expo-router";
import * as React from "react";

const ContentById = () => {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();

  const [folderInfo, setFolderInfo] = React.useState<Folder | null>(null);
  const [allFiles, setAllFiles] = React.useState<Track[] | null>(null);

  console.log("Folder Info", folderInfo);
  console.log("All files: ", allFiles);

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
          setAllFiles(files);
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

  return (
    <ThemedView className="w-screen h-screen bg-gray-900">
      <ThemedText>
        Content by ID: {id}
        {folderInfo && <ThemedText>{folderInfo.name}</ThemedText>}
      </ThemedText>
      {allFiles &&
        allFiles.map((file) => (
          <ThemedView key={file.id}>
            <ThemedText>{file.name}</ThemedText>
          </ThemedView>
        ))}
    </ThemedView>
  );
};

export default ContentById;
