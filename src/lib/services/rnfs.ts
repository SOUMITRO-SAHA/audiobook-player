import { DEFAULT_FOLDER_NAME } from "@/constants";
import * as MediaLibrary from "expo-media-library";
import { PermissionsAndroid } from "react-native";
import * as RNFS from "react-native-fs";
import { db } from "../db";
import { track } from "../db/schema";
import { Folder } from "@/types/database";
import { eq } from "drizzle-orm";
import { folders as folderSchema } from "@/lib/db/schema";

export const checkExternalStoragePermission = async (): Promise<Boolean> => {
  try {
    /**
     * This will return true or false
     */
    const granted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
    );
    return granted; // true or false
  } catch (err) {
    console.warn(err);
    throw err;
  }
};

export const requestExternalStoragePermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: "Audiobooks App Needs Storage Permission",
        message:
          "Audiobooks App needs access to your storage " +
          "to access files you selected.",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK",
      }
    );
    console.log("Granted ===>", granted);
    return granted;
  } catch (err) {
    console.warn(err);
    throw err;
  }
};

export const getDefaultDirectoryPath = async () => {
  return RNFS.ExternalStorageDirectoryPath + `/${DEFAULT_FOLDER_NAME}/`;
};

export const createDefaultDirectory = async () => {
  const defaultDirectory =
    RNFS.ExternalStorageDirectoryPath + `/${DEFAULT_FOLDER_NAME}/`;
  try {
    await RNFS.mkdir(defaultDirectory);
  } catch (error) {
    console.error(`Error creating ${DEFAULT_FOLDER_NAME} directory:`, error);
  }
};

export const readDefaultDirectory = async () => {
  const defaultDirectory = await getDefaultDirectoryPath();
  try {
    const filesAndDirs = await RNFS.readDir(defaultDirectory);

    return filesAndDirs;
  } catch (error) {
    console.error(`Error reading ${DEFAULT_FOLDER_NAME} directory:`, error);
    return [];
  }
};

export const readContentFromDirectory = async (directory: string) => {
  try {
    const filesAndDirs = await RNFS.readDir(directory);
    return filesAndDirs;
  } catch (error) {
    console.error(`Error reading directory:`, error);
    return [];
  }
};

export const readAllFileInfo = async ({
  folderName,
  dbFolder,
  files,
}: {
  folderName: string;
  dbFolder: Folder;
  files: RNFS.ReadDirItem[];
}) => {
  try {
    const folders = await MediaLibrary.getAlbumsAsync({
      includeSmartAlbums: true,
    });

    const targetFolder = folders.find((folder) =>
      folder.title.includes(folderName)
    );

    if (!targetFolder) {
      throw new Error("Target folder not found");
    }

    // Now adding the cover images to the database
    const { assets: coverImages } = await MediaLibrary.getAssetsAsync({
      first: 3,
      mediaType: "photo",
      album: targetFolder,
    });

    if (coverImages.length > 0) {
      const firstImage = coverImages[0];
      console.log("First image: ", firstImage);

      await db
        .update(folderSchema)
        .set({
          coverImage: String(firstImage.uri),
        })
        .where(eq(folderSchema.id, dbFolder.id))
        .returning({ id: folderSchema.id });
    }

    // Adding all the audio files to the database
    const { assets } = await MediaLibrary.getAssetsAsync({
      first: targetFolder.assetCount,
      mediaType: "audio",
      album: targetFolder,
    });

    const processedTracks = [];

    for (const assetList of assets) {
      try {
        const assetInfo = await MediaLibrary.getAssetInfoAsync(assetList);

        const rnfsFile = files.find((file) => file.name === assetInfo.filename);

        if (rnfsFile) {
          // Check if track already exists
          const existedTrack = await db.query.track.findMany({
            where: eq(track.uri, rnfsFile.path),
          });

          if (existedTrack.length === 0) {
            const newTrack = await db.insert(track).values({
              dbFolderId: dbFolder.id,
              folderId: assetInfo.id,
              name: rnfsFile.name ?? assetInfo.filename,
              uri: rnfsFile.path,
              duration: String(assetInfo.duration),
              albumId: assetInfo.albumId,
            });
            processedTracks.push(newTrack); // Track only if inserted
          }
        }
      } catch (error) {
        console.error(`Error processing asset ${assetList.id}:`, error);
      }
    }

    return processedTracks;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
