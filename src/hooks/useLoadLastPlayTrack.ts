import {
  getLastActiveTrack,
  getLastPlayingTimeStamp,
  getPlaylistWithPlayingTrack,
  updateActivePlayingTrackInDb,
} from "@/lib/db/query/playlist";
import * as React from "react";
import TrackPlayer, { Track, useActiveTrack } from "react-native-track-player";

const useLoadLastPlayTrack = () => {
  const activeTrack = useActiveTrack();

  // Load the last playing track when the app first opens
  React.useEffect(() => {
    const loadLastPlayTrack = async () => {
      const activePlaylist = await getPlaylistWithPlayingTrack();

      if (activePlaylist) {
        // TODO:
        console.log("I am here: ===>", activePlaylist);
      } else {
        const lastActiveTrack = await getLastActiveTrack();

        if (lastActiveTrack) {
          const currentTrack: Track = {
            url: lastActiveTrack.uri,
            duration: Number(lastActiveTrack.duration),
            title: lastActiveTrack.name,
            album: lastActiveTrack.name,
          };

          // Adding the track to the player
          await TrackPlayer.add([currentTrack]);

          // If there's an active track, seek to the last playing position
          if (activeTrack) {
            const timeStampInfo = await getLastPlayingTimeStamp(activeTrack);
            if (timeStampInfo) {
              await TrackPlayer.seekTo(Number(timeStampInfo.timestamp));
            }
          }
        }
      }
    };

    const timeId = setTimeout(loadLastPlayTrack, 1000);
    return () => clearTimeout(timeId);
  }, []);

  // Update the currently playing track in the database
  React.useEffect(() => {
    if (activeTrack && activeTrack.url) {
      const updateCurrentlyPlayingTrack = async () => {
        const res = await updateActivePlayingTrackInDb(activeTrack);

        const timeStampInfo = await getLastPlayingTimeStamp(activeTrack);

        if (timeStampInfo) {
          await TrackPlayer.seekTo(Number(timeStampInfo.timestamp));
        }

        return res;
      };

      const timeId = setTimeout(updateCurrentlyPlayingTrack, 1000);
      return () => clearTimeout(timeId);
    }
  }, [activeTrack]);
};

export default useLoadLastPlayTrack;
