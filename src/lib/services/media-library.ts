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
    const now = Date.now();
    const oneMinute = 60 * 1000;

    // Check if the cache is empty or if the cache is older than 1 minute
    if (
      !AssetsCache.assets ||
      (AssetsCache.lastFetched && now - AssetsCache.lastFetched > oneMinute)
    ) {
      let allAssets = await MediaLibrary.getAssetsAsync({
        mediaType: "audio",
      });

      allAssets = await MediaLibrary.getAssetsAsync({
        mediaType: "audio",
        first: allAssets.totalCount,
      });

      // Now update the cache
      AssetsCache.assets = allAssets.assets;
      AssetsCache.lastFetched = now;
    }

    return AssetsCache.assets;
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      ToastAndroid.show(error.message, ToastAndroid.SHORT);
    }
  }
};

export const readFilesFromAssetsByPathName = async (path: string) => {
  try {
    const assets = await loadAllAssets();
    if (assets) {
      const file = assets.find((asset) => asset.uri.includes(path));
      return file;
    }
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      ToastAndroid.show(error.message, ToastAndroid.SHORT);
    }
    throw error;
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

      // Sorting the Assets
      const sortedAudios = files?.assets?.sort((a, b) => {
        return a.filename.localeCompare(b.filename);
      });

      return { audios: sortedAudios, images: coverImages.assets };
    }
    return null;
  } catch (error) {
    console.error(error);
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
