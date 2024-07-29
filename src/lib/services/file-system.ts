import { extractUriToGetName } from "@/lib/utils";
import { eq } from "drizzle-orm";
import * as FileSystem from "expo-file-system";
import { ToastAndroid } from "react-native";
import { db } from "@/lib/db";
import { folders, track } from "@/lib/db/schema";

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
        let newFolder:
          | {
              id: number;
            }[]
          | undefined
          | null;

        if (uri && folderName) {
          newFolder = await db
            .insert(folders)
            .values({
              uri: uri,
              name: folderName,
            })
            .returning({
              id: folders.id,
            });
        }

        console.log("New Folder ===>", newFolder);

        // Getting all the files in the folder
        const files =
          await FileSystem.StorageAccessFramework.readDirectoryAsync(uri);

        // Then add to the Database
        await Promise.all(
          files.map(async (file) => {
            const fileUri = file;
            console.log("File Uri", fileUri);

            // Extracting the Images from the files
            if (
              file.includes(".jpg") ||
              file.includes(".png") ||
              file.includes(".jpeg")
            ) {
              if (file) coverImages.push(file);
            } else if (
              file.includes(".mp3") ||
              file.includes(".wav") ||
              file.includes(".aac")
            ) {
              // Extracting the file name from the URI
              const extractedFileName = extractUriToGetName(fileUri);

              console.log("File Name ===>", extractedFileName);

              if (newFolder && fileUri && extractedFileName) {
                const response = await db.insert(track).values({
                  folderId: newFolder[0]?.id,
                  name: extractedFileName,
                  uri: fileUri,
                });

                console.log("File from Database ===>", response);

                if (response) {
                  console.log("File Added Successfully!!!");
                } else {
                  console.error("Failed to Add the file");
                }
              }
            }
          })
        );

        console.log("Cover Images", coverImages);
        if (coverImages.length > 0 && newFolder) {
          const firstImage = coverImages[0];

          await db
            .update(folders)
            .set({
              coverImage: firstImage,
            })
            .where(eq(folders.id, newFolder[0]?.id));
        }
      } else {
        ToastAndroid.show("Folder Already Exists!!!", ToastAndroid.SHORT);
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
