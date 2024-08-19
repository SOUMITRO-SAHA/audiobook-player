import { ToastAndroid } from "react-native";
import TrackPlayer from "react-native-track-player";
import { updateActivePlayingTrackInDb } from "../db/query/playlist";
import { sleep } from "../utils";

export const takingBackupBeforeClosing = async () => {
  const activeTrack = await TrackPlayer.getActiveTrack();

  try {
    if (activeTrack) {
      const res = await updateActivePlayingTrackInDb(activeTrack);
    }
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      ToastAndroid.show(error.message, ToastAndroid.LONG);
    }
    return;
  } finally {
    await sleep(1000);
    return;
  }
};
