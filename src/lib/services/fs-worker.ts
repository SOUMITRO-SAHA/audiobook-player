import { eq } from "drizzle-orm";
import { ReadDirItem } from "react-native-fs";
import { db } from "../db";
import { folders } from "../db/schema";
import {
  createDefaultDirectory,
  readAllFileInfo,
  readContentFromDirectory,
  readDefaultDirectory,
} from "./rnfs";
import { Folder } from "@/types/database";
import * as MediaLibrary from "expo-media-library";
import { useAppStore } from "@/store";

export const addNewFolderToTheApplication = async () => {
  // Zustand State
  const { setLibraryLoading, resetLibraryLoading } = useAppStore.getState();

  setLibraryLoading();
  try {
    const defaultDirectory = await readDefaultDirectory();

    // If the Folder is not present the create a new default Folder
    if (defaultDirectory.length === 0) {
      // It will gonna create a new default folder
      await createDefaultDirectory();
    }

    // Now Reading Each Folders Recursively
    return await readFolderContentRecursively(defaultDirectory);
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      // TODO:
    }
  } finally {
    resetLibraryLoading();
  }
};
export const readFolderContentRecursively = async (
  localFolders: ReadDirItem[]
) => {
  try {
    if (localFolders && localFolders.length > 0) {
      localFolders.forEach(async (folder) => {
        const folderName = folder.name;
        const folderPath = folder.path;
        const isDirectory = folder.isDirectory();

        if (isDirectory) {
          let newFolder: Folder[];

          // If the directory is direct child of the default directory then only recursively call this function
          // else don't have to do anything

          // First check if the folder exists in the Database
          const existingFolder = await db.query.folders.findMany({
            where: eq(folders.uri, folderPath),
          });

          if (existingFolder && existingFolder.length === 0) {
            // Creating a new Folder
            newFolder = await db
              .insert(folders)
              .values({
                name: folderName,
                uri: folderPath,
              })
              .returning();
          } else {
            newFolder = existingFolder;
          }

          // Now Read All the files in the folder
          const files = await readContentFromDirectory(folderPath);

          // Calling the `readAllFileInfo` which will read the metadata of each files and update the database
          if (newFolder && newFolder.length > 0 && files.length > 0) {
            const res = await readAllFileInfo({
              dbFolder: newFolder[0],
              folderName,
              files,
            });

            if (res && res.length > 0) {
              return true;
            }
          }
        }
      });
    }

    return false;
  } catch (error) {
    console.error(
      `Error while reading the folders Content Recursively: `,
      error
    );
  }
};

export const getFolderContentByFolderName = async (folderName: string) => {
  try {
    const contents = await MediaLibrary.getAlbumsAsync();

    const filteredContent = contents.filter(
      (content) => content.title === folderName
    );

    if (filteredContent.length > 0) {
      // Getting all the files
      const files = await MediaLibrary.getAssetsAsync({
        mediaType: "audio",
        album: filteredContent[0],
      });

      // Getting the cover images
      const coverImages = await MediaLibrary.getAssetsAsync({
        mediaType: "photo",
        album: filteredContent[0],
      });

      return { audios: files.assets, images: coverImages.assets };
    }
    return null;
  } catch (error) {
    console.error(error);
  }
};
