import React from "react";
import * as BackgroundFetch from "expo-background-fetch";
import { useActiveTrack } from "react-native-track-player";
import { BACKGROUND_TASKS } from "@/lib/services/background-tasks";

export const useBackgroundTimeStamp = () => {
  // Hook
  const activeTrack = useActiveTrack();

  React.useEffect(() => {
    const registerTask = async () => {
      try {
        await BackgroundFetch.registerTaskAsync(BACKGROUND_TASKS.TIMESTAMP, {
          minimumInterval: 60 * 5, // 5 minute
          stopOnTerminate: true,
          startOnBoot: false,
        });
      } catch (error) {
        console.error("Task registration failed:", error);
      }
    };

    if (activeTrack) {
      registerTask();
    }
  }, [activeTrack]);
};
