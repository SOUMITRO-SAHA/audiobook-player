import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { db } from "@/lib/db";
import {
  addAllFilesToFolder,
  fetchFolderById,
} from "@/lib/services/file-system";
import { Folder } from "@/types/database";
import { useLocalSearchParams, useNavigation } from "expo-router";
import * as React from "react";

const ContentById = () => {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();

  const [folderInfo, setFolderInfo] = React.useState<Folder | null>(null);

  // Side Effects
  React.useEffect(() => {
    const getAllFilesByFolderId = async (folderId: string) => {
      try {
        const files = await fetchFolderById(folderId);
        if (files.length > 0) {
          setFolderInfo(files[0]);
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
      const getAllFilesByFolderUri = async (uri: string) => {
        try {
          const files = await addAllFilesToFolder(uri);
        } catch (error) {
          console.error(`Error adding files to the database:`, error);
        }
      };

      getAllFilesByFolderUri(folderInfo.uri);
    }
  }, [folderInfo]);

  React.useEffect(() => {
    if (folderInfo) {
      navigation.setOptions({ title: folderInfo.name });
    }
  }, [id, navigation, folderInfo]);

  return (
    <ThemedView className="w-screen h-screen bg-gray-900">
      <ThemedText>ThemedView</ThemedText>
    </ThemedView>
  );
};

export default ContentById;
