import * as RNFS from "react-native-fs";
import { PermissionsAndroid } from "react-native";
import { DEFAULT_FOLDER_NAME } from "@/constants";

export const checkExternalStoragePermission = async () => {
  try {
    const granted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
    );
    return granted;
  } catch (err) {
    console.warn(err);
    return false;
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
    return granted;
  } catch (err) {
    console.warn(err);
    throw err;
  }
};

export const getDefaultDirectoryPath = async () => {
  const externalStorageDirectory = RNFS.ExternalStorageDirectoryPath;
  const defaultDirectory = `${externalStorageDirectory}/${DEFAULT_FOLDER_NAME}`;
  return defaultDirectory;
};

export const createDefaultDirectory = async () => {
  const defaultDirectory = await getDefaultDirectoryPath();
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
