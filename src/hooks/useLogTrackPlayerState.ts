import { Event, useTrackPlayerEvents } from "react-native-track-player";

const events = [
  Event.PlaybackState,
  Event.PlaybackError,
  Event.PlaybackActiveTrackChanged,
];

const useLogTrackPlayerState = () => {
  useTrackPlayerEvents(events, async (event) => {
    if (event.type === Event.PlaybackState) {
      console.log("Playback state: ", event.state);
    }
    if (event.type === Event.PlaybackError) {
      console.error(`An error occurred: `, event);
    }
    if (event.type === Event.PlaybackActiveTrackChanged) {
      console.info("Track Change: ", event.index);
    }
  });
};

export default useLogTrackPlayerState;
