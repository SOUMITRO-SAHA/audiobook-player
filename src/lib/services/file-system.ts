import { extractSubFolderNameFromUri, extractUriToGetName } from "@/lib/utils";
import { eq } from "drizzle-orm";
import * as FileSystem from "expo-file-system";
import { ToastAndroid } from "react-native";
import { db } from "../db";
import { folders, permittedFolders } from "../db/schema";

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

export const fetchFolderById = async (id: string) => {
  try {
    const folder = await db.query.folders.findMany({
      where: eq(folders.id, Number(id)),
    });

    if (!folder) {
      throw new Error(`Folder with this uri not found`);
    }
    return folder;
  } catch (error) {
    console.error("Error getting folder by ID:", error);
    throw error;
  }
};

export const fetchAllFilesByFolderId = async (id: string) => {};

export const addAllFilesToFolder = async (uri: string) => {
  try {
    // First fetch all the files from the Provided folder uri
  } catch (error) {
    console.error(`Failed to add files to the Database`, error);
    if (error instanceof Error) {
      ToastAndroid.show(error.message, ToastAndroid.SHORT);
    }
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

export const addSubfolderUnderMainFolder = async (
  uri?: string
): Promise<any> => {
  try {
    if (uri) {
      // First Time Only when the Parent Folder initiated
      const subFolders =
        await FileSystem.StorageAccessFramework.readDirectoryAsync(uri);

      if (subFolders.length > 0) {
        return await Promise.all(
          subFolders.map(async (subFolder) => {
            // First Check whether the folder exists or not
            const existedFolder = await db.query.folders.findMany({
              where: eq(folders.uri, subFolder),
            });

            // If the folder does not exists
            if (!existedFolder) {
              // Then add the the database
              const subFolderName = extractSubFolderNameFromUri(subFolder);

              // Add All the Subfolders to the Database
              if (subFolder && subFolderName) {
                const response = await db.insert(folders).values({
                  uri: subFolder,
                  name: subFolderName,
                });

                if (response) {
                  ToastAndroid.show(
                    `Subfolder "${subFolderName}" added`,
                    ToastAndroid.SHORT
                  );

                  return response;
                } else {
                  ToastAndroid.show(
                    `Failed to Add Subfolder "${subFolderName}"`,
                    ToastAndroid.SHORT
                  );
                  return null;
                }
              }
            }

            return existedFolder;
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
              return await addSubfolderUnderMainFolder(folder.uri);
            } catch (error) {
              console.error(
                `Error reading directory for folder ${folder.uri}:`,
                error
              );
              return error;
            }
          })
        );
      }
    }
  } catch (error) {
    console.error("Error in addSubfolderUnderMainFolder:", error);
    return error;
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
