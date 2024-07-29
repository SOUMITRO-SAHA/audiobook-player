import { ToastAndroid } from "react-native";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { folders, track } from "../schema";

export const fetchAllFolders = async () => {
  try {
    const response = await db.query.folders.findMany();
    if (response.length > 0) return response;
    return null;
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      ToastAndroid.show(error.message, ToastAndroid.SHORT);
    }
  }
};

export const fetchFolderByFolderId = async (folderId: number) => {
  try {
    const response = await db.query.folders.findFirst({
      where: eq(folders.id, folderId),
    });

    if (response) return response;
    return null;
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      ToastAndroid.show(error.message, ToastAndroid.SHORT);
    }
  }
};

export const fetchAllFilesByFolderId = async (folderId: number) => {
  try {
    const response = await db.query.track.findMany({
      where: eq(track.folderId, folderId),
    });
    if (response.length > 0) return response;
    return null;
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      ToastAndroid.show(error.message, ToastAndroid.SHORT);
    }
  }
};

export const deleteFolderByFolderId = async (folderId: number) => {
  try {
    // Fetch the folder details
    const folder = await db.query.folders.findFirst({
      where: eq(folders.id, folderId),
    });

    if (!folder) {
      console.warn(`Folder with ID ${folderId} not found.`);
      return;
    }

    // Delete tracks from the database
    await db.delete(track).where(eq(track.folderId, folderId));

    // Delete the folder from the database
    await db.delete(folders).where(eq(folders.id, folderId));

    const msg = `Folder with ID ${folderId} and its contents have been deleted successfully.`;
    console.log(msg);

    ToastAndroid.show(msg, ToastAndroid.SHORT);
  } catch (error) {
    console.error("Error deleting folder:", error);
    if (error instanceof Error) {
      ToastAndroid.show(error.message, ToastAndroid.SHORT);
    }

    throw error;
  }
};
