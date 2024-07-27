import { extractUriToGetName } from "@/lib/utils";
import { eq } from "drizzle-orm";
import * as FileSystem from "expo-file-system";
import { ToastAndroid } from "react-native";
import { db } from "../db";
import { permittedFolders } from "../db/schema";
import { useDispatch } from "react-redux";

export const getAllFolders = async (): Promise<string[] | null> => {
  try {
    const folders = await db.query.folders.findMany();
    const allFiles: string[] = [];

    for (const folder of folders) {
      // Gets SAF URI from response
      const uri = folder.uri;
      console.log("Directory URI ===>", uri);

      // Gets All files inside of the Selected Directory
      const files = await FileSystem.StorageAccessFramework.readDirectoryAsync(
        uri
      );

      console.log("Files ===>", files);

      allFiles.push(...files);
    }

    return allFiles.length ? allFiles : null;
  } catch (error) {
    console.error("Error getting folders:", error);
    return null;
  }
};

export const getAllFilesByFolderUri = async (uri: string) => {
  try {
    const folder = await db.query.folders.findFirst();

    if (!folder) {
      throw new Error(`Folder with this uri ${uri} not found`);
    }
    return folder;
  } catch (error) {
    console.error("Error getting folder by ID:", error);
    throw error;
  }
};

export const addNewFolder = async () => {
  try {
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
    }

    if (folder?.granted && folder?.directoryUri) {
      // First Check whether the folder already exists
      const existingFolder = await db.query.permittedFolders.findFirst({
        where: eq(permittedFolders.uri, folder.directoryUri),
      });

      // Then add to the Database
      if (!existingFolder) {
        const uri = folder.directoryUri;
        const extractedFolderName = extractUriToGetName(uri);

        if (uri && extractedFolderName) {
          const response = await db.insert(permittedFolders).values({
            uri: uri,
            name: extractedFolderName,
          });

          if (response) {
            ToastAndroid.show("Folder Added!!!", ToastAndroid.SHORT);

            // Add Subfolders under the main folder
            await addSubfolderUnderMainFolder(uri);
          } else {
            ToastAndroid.show("Failed to Add the folder", ToastAndroid.SHORT);
          }
        }
      }

      ToastAndroid.show("Folder Already Exists!!!", ToastAndroid.SHORT);
    }
  } catch (error) {
    console.error("Error adding new folder:", error);
    throw error;
  }
};

export const addSubfolderUnderMainFolder = async (uri?: string) => {
  try {
    if (uri) {
      // First Time Only when the Parent Folder initiated
      const subFolders =
        await FileSystem.StorageAccessFramework.readDirectoryAsync(uri);

      if (subFolders.length > 0) {
        await Promise.all(
          subFolders.map(async (folder) => {
            console.log("1st", folder);
          })
        );
      }
    } else {
      // Get the Folders from the DB
      const permittedFolders = await db.query.permittedFolders.findMany();

      if (permittedFolders.length > 0) {
        await Promise.all(
          permittedFolders.map(async (folder) => {
            try {
              // Getting all the Folders under the folder
              const subFolders =
                await FileSystem.StorageAccessFramework.readDirectoryAsync(
                  folder.uri
                );
              // You can process subFolders here if needed
              console.log("2nd", subFolders);
            } catch (error) {
              console.error(
                `Error reading directory for folder ${folder.uri}:`,
                error
              );
            }
          })
        );
      }
    }
  } catch (error) {
    console.error("Error in addSubfolderUnderMainFolder:", error);
  }
};

export const checkFolderPermission = async (
  albumUri?: string
): Promise<FileSystem.FileSystemRequestDirectoryPermissionsResult> => {
  try {
    // Requests permission for external directory
    const permissions =
      await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync(
        albumUri
      );

    if (!permissions.granted) {
      console.warn("Permission not granted for the directory:", albumUri);
    }

    return permissions;
  } catch (error) {
    console.error(`Error requesting directory permissions:`, error);
    throw error;
  }
};
