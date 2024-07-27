import { ToastAndroid } from "react-native";
import { db } from "../db";

export const fetchPermittedFolders = async () => {
  try {
    const response = await db.query.permittedFolders.findMany();
    if (response) return response;
    return null;
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      ToastAndroid.show(error.message, ToastAndroid.SHORT);
    }
  }
};
