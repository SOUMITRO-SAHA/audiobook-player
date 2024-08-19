import { DEFAULT_FOLDER_NAME } from "@/constants";
import * as FileSystem from "expo-file-system";
import { ToastAndroid } from "react-native";

export const createDefaultFolder = async () => {
  try {
    const directory =
      await FileSystem.StorageAccessFramework.readDirectoryAsync(
        DEFAULT_FOLDER_NAME
      );

    // const defaultFolderRecord = await db.insert(defaultFolder).values({
    //   title: DEFAULT_FOLDER_NAME,
    // });
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      ToastAndroid.show(error.message, ToastAndroid.SHORT);
    }
  }
};

export const checkFolderPermission =
  async (): Promise<FileSystem.FileSystemRequestDirectoryPermissionsResult> => {
    try {
      // Requests permission for external directory
      const permissions =
        await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

      if (!permissions.granted) {
        const message = "Permission not granted for the directory";
        console.warn(message);
        ToastAndroid.show(message, ToastAndroid.SHORT);
      }

      return permissions;
    } catch (error) {
      const message = `Error requesting directory permissions:`;
      console.error(message, error);
      if (error instanceof Error) {
        ToastAndroid.show(`${message}${error.message}`, ToastAndroid.SHORT);
      }
      throw error;
    }
  };
