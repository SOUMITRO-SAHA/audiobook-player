import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import { stopPlayer, trackActiveTimeStampInBackground } from "./process-data";

export const BACKGROUND_TASKS = {
  TIMESTAMP: "TIMESTAMP_UPDATE_TASK",
  SLEEP_TIMER: "SLEEP_TIMER_COUNTER",
};

// Define the task that runs in the background
TaskManager.defineTask(BACKGROUND_TASKS.TIMESTAMP, async () => {
  try {
    await trackActiveTimeStampInBackground();

    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error("Error in background task:", error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

TaskManager.defineTask(BACKGROUND_TASKS.SLEEP_TIMER, async () => {
  try {
    await stopPlayer();

    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error("Error in background task:", error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});
