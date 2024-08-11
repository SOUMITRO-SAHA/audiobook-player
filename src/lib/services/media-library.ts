import { DEFAULT_FOLDER_NAME, EXTERNAL_DIRECTORY_URL } from "@/constants";
import { eq } from "drizzle-orm";
import * as MediaLibrary from "expo-media-library";
import { ToastAndroid } from "react-native";
import { db } from "../db";
import { defaultFolder, track } from "../db/schema";
import { addNewFolder } from "./file-system";
import * as FileSystem from "expo-file-system";

export const addNewMediaLibrary = async () => {
  try {
    const mediaLibrary = await MediaLibrary.getPermissionsAsync();

    if (!mediaLibrary.granted) {
      const permissions = await MediaLibrary.requestPermissionsAsync();
      if (!permissions.granted) {
        throw new Error("Permission to access media library denied.");
      }
    } else {
      // Getting All the Folders from the Media Library
      const allFolders = await addNewFolder();

      if (allFolders) {
        // Only Fetching the Audio Files
        let albums = await MediaLibrary.getAssetsAsync({
          mediaType: "audio",
        });

        albums = await MediaLibrary.getAssetsAsync({
          mediaType: "audio",
          first: albums.totalCount,
        });

        // Now Extract The Folders Which are inside the `Audiobook` Folder

        Promise.all(
          albums?.assets?.map(async (folder, idx) => {
            if (folder.uri.includes(allFolders.name)) {
              // First Check if the tract already exists
              const existedTrack = await db.query.track.findMany({
                where: eq(track.uri, folder.uri),
              });

              if (existedTrack.length === 0) {
                // Adding the Track Files to the Database
                await db.insert(track).values({
                  dbFolderId: allFolders.id,
                  folderId: folder.id,
                  name: folder.filename,
                  uri: folder.uri,
                  duration: String(folder.duration),
                  albumId: folder?.albumId,
                });
              }
            }
          })
        );
      }
    }
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      ToastAndroid.show(error.message, ToastAndroid.SHORT);
    }
  }
};

export const getOrCreateDefaultDirectory = async () => {
  try {
    const permission = await GetPermissionStatus();
    if (!permission.granted) {
      await RequestForStoragePermissions();
    }

    // Now Update the default Folder at the Database
    const existingDefaultFolder = await db.query.defaultFolder.findFirst();

    if (!existingDefaultFolder) {
      const allFolders = await MediaLibrary.getAlbumsAsync();

      if (allFolders.length > 0) {
        const audiobookFolder = allFolders.find(
          (folder) => folder.title === DEFAULT_FOLDER_NAME
        );

        if (!audiobookFolder) {
          ToastAndroid.show(
            `No Folder Found with the name ${DEFAULT_FOLDER_NAME}`,
            ToastAndroid.CENTER
          );
          return;
        }

        // Creating a new default folder
        const newDefaultFolder = await db
          .insert(defaultFolder)
          .values({
            folderId: audiobookFolder.id,
            title: audiobookFolder.title,
          })
          .returning();

        return newDefaultFolder[0];
      }
    }

    return existingDefaultFolder;
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      ToastAndroid.show(error.message, ToastAndroid.SHORT);
    }
  }
};

type AssetsCacheProps = {
  assets: MediaLibrary.Asset[] | null;
  lastFetched: number | null;
};

const AssetsCache: AssetsCacheProps = {
  assets: null,
  lastFetched: null,
};

const loadAllAssets = async () => {
  try {
    if (
      !AssetsCache.assets ||
      (AssetsCache.assets &&
        AssetsCache.lastFetched &&
        AssetsCache.lastFetched < Date.now())
    ) {
      let allAssets = await MediaLibrary.getAssetsAsync({
        mediaType: "audio",
      });
      allAssets = await MediaLibrary.getAssetsAsync({
        mediaType: "audio",
        first: allAssets.totalCount,
      });

      // Now push to the Cache
      AssetsCache.assets = allAssets.assets;
      AssetsCache.lastFetched = Date.now();
    }
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      ToastAndroid.show(error.message, ToastAndroid.SHORT);
    }
  }
};

export const readDefaultDirectory = async () => {
  try {
    const defaultFolderUri = `${EXTERNAL_DIRECTORY_URL}${DEFAULT_FOLDER_NAME}`;
    const getDefaultFolder = await getOrCreateDefaultDirectory();

    if (getDefaultFolder) {
      const folderInfo = await FileSystem.readDirectoryAsync(defaultFolderUri);

      folderInfo?.map(async (folderName) => {
        const url = encodeURIComponent(folderName);
        console.log("URL ==>", url);
        const info = await FileSystem.getInfoAsync(
          `${defaultFolderUri}/${url}`
        );

        console.log("All Assets form the Audiobooks ===>", info);
      });
    }
  } catch (error) {}
};

export const getAllFoldersFromAudiobook = async () => {
  try {
    const allFolders = await MediaLibrary.getAssetsAsync();
    return allFolders;
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      ToastAndroid.show(error.message, ToastAndroid.SHORT);
    }
  }
};

export const RequestForStoragePermissions = async () => {
  const permission = await MediaLibrary.requestPermissionsAsync(false, [
    "audio",
    "photo",
  ]);
  return permission;
};

export const GetPermissionStatus = async () => {
  const permission = await MediaLibrary.getPermissionsAsync(false, [
    "audio",
    "photo",
  ]);
  return permission;
};
