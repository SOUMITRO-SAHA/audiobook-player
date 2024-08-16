import * as React from "react";
import TrackPlayer from "react-native-track-player";

export const useSleepTimer = () => {
  const [timer, setTimer] = React.useState<NodeJS.Timeout | null>(null);

  const startTimer = (minutes: number) => {
    // Clear any existing timer
    if (timer) clearTimeout(timer);

    // Convert minutes to milliseconds
    const timeout = setTimeout(async () => {
      await TrackPlayer.pause();
    }, minutes * 60 * 1000);

    setTimer(timeout);
  };

  const cancelTimer = () => {
    if (timer) clearTimeout(timer);
    setTimer(null);
  };

  // Side Effect
  React.useEffect(() => {
    // Clean up timer when the component unmounts or when a new timer is set
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timer]);

  return {
    startTimer,
    cancelTimer,
  };
};
