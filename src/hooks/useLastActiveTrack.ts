import * as React from "react";
import { Track, useActiveTrack } from "react-native-track-player";

const useLastActiveTrack = () => {
  const [lastActiveTrack, setLastActiveTrack] = React.useState<Track>();

  // Hooks
  const activeTrack = useActiveTrack();

  // Effects
  React.useEffect(() => {
    if (activeTrack) return;

    setLastActiveTrack(activeTrack);
  }, [activeTrack]);

  return lastActiveTrack;
};

export default useLastActiveTrack;
