import { BACKGROUND_TASKS } from "@/lib/services/background-tasks";
import * as BackgroundFetch from "expo-background-fetch";
import * as React from "react";

export default function useBackgroundTask(sleepTimeMinutes: number | null) {
  const [isTimerRunning, setIsTimerRunning] = React.useState(false);

  // Side Effect
  React.useEffect(() => {
    if (sleepTimeMinutes) {
      BackgroundFetch.registerTaskAsync(BACKGROUND_TASKS.SLEEP_TIMER, {
        minimumInterval: sleepTimeMinutes * 60, // Convert minutes to seconds
        stopOnTerminate: false,
      })
        .then(() => setIsTimerRunning(true))
        .catch((error) => {
          console.error("Error registering background task:", error);
        });
    }
  }, [sleepTimeMinutes]);

  return isTimerRunning;
}
