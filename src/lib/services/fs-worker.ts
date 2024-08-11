import { DEFAULT_AUDIOBOOK_FOLDER_URI } from "@/constants";
import { Asset } from "expo-media-library";
import { ToastAndroid } from "react-native";
import * as RNFS from "react-native-fs";
import { readFilesFromAssetsByPathName } from "./media-library";

type ResponseType = {
  directories: RNFS.ReadDirItem[];
  files: Asset[];
};
export const readDefaultDirectory = async (): Promise<ResponseType | null> => {
  try {
    const files: Asset[] = [];
    const directories: RNFS.ReadDirItem[] = [];
    const doesDirExist = await RNFS.exists(DEFAULT_AUDIOBOOK_FOLDER_URI);

    if (doesDirExist) {
      const defaultDirectory = await RNFS.readDir(DEFAULT_AUDIOBOOK_FOLDER_URI);

      if (defaultDirectory && defaultDirectory.length > 0) {
        for (const data of defaultDirectory) {
          if (data.isFile()) {
            const file = await readFilesFromAssetsByPathName(data.path);
            if (file) {
              files.push(file);
            }
          } else {
            directories.push(data);
          }
        }
      }
    } else {
      await RNFS.mkdir(DEFAULT_AUDIOBOOK_FOLDER_URI);
    }

    return { files: files, directories: directories };
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      ToastAndroid.show(error.message, ToastAndroid.SHORT);
    }
    throw error;
  }
};
