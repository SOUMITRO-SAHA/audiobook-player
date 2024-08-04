import { eq } from "drizzle-orm";
import * as MediaLibrary from "expo-media-library";
import { ToastAndroid } from "react-native";
import { db } from "../db";
import { track } from "../db/schema";
import { addNewFolder } from "./file-system";

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
