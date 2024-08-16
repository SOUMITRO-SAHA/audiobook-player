// import { useEffect } from "react";
// import BackgroundFetch from "react-native-background-fetch";
// import { useIsPlaying } from "react-native-track-player";

// // Custom hook for background tasks
// export const useBackgroundTasks = () => {
//   const { playing } = useIsPlaying();

//   const initBackgroundFetch = async () => {
//     // BackgroundFetch configuration
//     const configureBackgroundFetch = async () => {
//       const onEvent = async (taskId: string) => {
//         // This block will run every 2 minutes
//         console.log("Background task running...");

//         // Check if the music is playing
//         if (playing) {
//           console.log("Music is currently playing");
//         } else {
//           console.log("Music is not playing");
//         }

//         // You can simulate a DB update or any other background task here
//         console.log("Updating the database from the background task...");

//         // Mark the task as complete
//         BackgroundFetch.finish(taskId);
//       };

//       const onTimeout = (taskId: string) => {
//         console.error(
//           "Background Task Executed successfully with the task ID:",
//           taskId
//         );
//         BackgroundFetch.finish(taskId);
//       };

//       await BackgroundFetch.configure(
//         {
//           minimumFetchInterval: 1, // Fetch interval in minutes
//           stopOnTerminate: true,
//           startOnBoot: false,
//           enableHeadless: false, // Enable/Disable to run tasks even when the app is closed
//         },
//         onEvent,
//         onTimeout
//       );

//       // Start the background fetch task
//       BackgroundFetch.start();
//     };

//     if (playing) {
//       console.log("I am playing!!!");

//       // Call the configuration function
//       const status = await configureBackgroundFetch();
//       console.log("[BackgroundFetch] configure status: ", status);
//     }
//   };

//   useEffect(() => {
//     initBackgroundFetch();
//   }, []);
// };
