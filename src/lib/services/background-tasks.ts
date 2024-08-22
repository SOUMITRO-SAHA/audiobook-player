import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";
import { useCounter } from "@/store/counter";
import { count } from "drizzle-orm";

export const BACKGROUND_TASK_NAME = "COUNTER_TASK";

// Define the task that runs in the background
TaskManager.defineTask(BACKGROUND_TASK_NAME, async () => {
  try {
    console.log("I am active bro!!!");
    let counter = await getCounterFromStorage();
    counter += 1;

    // Update counter in storage
    await saveCounterToStorage(counter);

    console.log("Counter:", counter);

    // This is important to indicate the task execution was successful
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error("Error in background task:", error);

    // Return Failed in case of any error
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

// Helper functions to interact with storage
async function getCounterFromStorage() {
  const { count } = useCounter();
  return count || 0;
}

async function saveCounterToStorage(counter: number) {
  const { setCount } = useCounter();
  setCount(counter);
}
