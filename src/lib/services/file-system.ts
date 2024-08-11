import { DEFAULT_FOLDER_NAME } from "@/constants";
import { db } from "@/lib/db";
import { folders } from "@/lib/db/schema";
import { extractUriToGetName } from "@/lib/utils";
import { eq } from "drizzle-orm";
import * as FileSystem from "expo-file-system";
import { ToastAndroid } from "react-native";

export const createDefaultFolder = async () => {
  try {
    const directory =
      await FileSystem.StorageAccessFramework.readDirectoryAsync(
        DEFAULT_FOLDER_NAME
      );

    console.log("New directory: ", directory);

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

export const addNewFolder = async () => {
  try {
    const coverImages: string[] = [];

    // Add new folder to the folders table
    const folder = (await checkFolderPermission()) as unknown as {
      directoryUri: string;
      granted: boolean;
    };

    if (!folder) {
      ToastAndroid.show(
        "Permission not granted for the directory",
        ToastAndroid.SHORT
      );
      return;
    }

    if (folder.granted && folder.directoryUri) {
      // First Check whether the folder already exists
      const existingFolder = await db.query.folders.findMany({
        where: eq(folders.uri, folder.directoryUri),
      });

      // Then add to the Database
      if (existingFolder.length === 0) {
        const uri = folder.directoryUri;
        const folderName = extractUriToGetName(uri);

        // First Create a folder in the database
        let newFolder;
        if (uri && folderName) {
          newFolder = await db
            .insert(folders)
            .values({
              uri: uri,
              name: folderName,
            })
            .returning({
              id: folders.id,
              name: folders.name,
            });
        }

        // Getting all the files in the folder
        const files =
          await FileSystem.StorageAccessFramework.readDirectoryAsync(uri);

        // Then add to the Database
        await Promise.all(
          files.map(async (file) => {
            // Extracting the Images from the files
            if (
              file.includes(".jpg") ||
              file.includes(".png") ||
              file.includes(".jpeg")
            ) {
              if (file) coverImages.push(file);
            }
          })
        );

        // Adding the Images to the Database
        if (coverImages.length > 0 && newFolder) {
          const firstImage = coverImages[0];

          const response = await db
            .update(folders)
            .set({
              coverImage: firstImage,
            })
            .where(eq(folders.id, newFolder[0]?.id))
            .returning({
              id: folders.id,
              name: folders.name,
            });

          if (response.length > 0) {
            return response[0];
          } else {
            return null;
          }
        }

        if (newFolder) {
          return newFolder[0];
        } else {
          return null;
        }
      } else {
        ToastAndroid.show("Folder Already Exists!!!", ToastAndroid.SHORT);
        return existingFolder[0];
      }
    }
  } catch (error) {
    console.error("Error adding new folder:", error);
    throw error;
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
