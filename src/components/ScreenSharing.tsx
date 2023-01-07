import {
  AgoraVideoPlayer,
  ClientConfig,
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  ILocalAudioTrack,
  ILocalVideoTrack,
  IMicrophoneAudioTrack,
  createClient,
  createMicrophoneAndCameraTracks,
  createScreenVideoTrack,
} from "agora-rtc-react";
import React, { useEffect, useRef, useState } from "react";

import Video from "./Video";
import { useAdmin } from "../GlobalContext";

interface Props {
  screenshareConfig: any;
  onScreenSharingStopped(): void;
}

// Create screen client
const useScreenVideoClient = createClient({
  mode: "rtc",
  codec: "vp8",
});
// ScreenSharing component
const ScreenSharing = (props: Props) => {
  const [initialized, setInitialized] = useState(false);
  const first = useRef(false);
  const admin = useAdmin();

  // const playVideo = (user, vidDiv) => {
  //   console.log("하..", user, vidDiv);
  //   user && vidDiv && user.videoTrack && user.videoTrack.play(vidDiv);
  // };

  // const stopVideo = (user, vidDiv) => {
  //   user && vidDiv && user.videoTrack && user.videoTrack.stop();
  // };
  useEffect(() => {
    console.log("몇 번 렌더링 되는지??", props, first.current);
    first.current = true;
  }, []);

  const useScreenVideoTrack = createScreenVideoTrack({
    encoderConfig: "1080p_1",
    optimizationMode: "detail",
  });
  const getScreenSharingVideoTrack = (
    tracks: ILocalVideoTrack | [ILocalVideoTrack, ILocalAudioTrack]
  ) => {
    if (Array.isArray(tracks)) {
      return tracks[0];
    } else {
      return tracks;
    }
  };
  // Using the screen client hook
  const screenVideoClient = useScreenVideoClient();
  const { ready, tracks, error } = useScreenVideoTrack();
  const tracksRef = useRef(tracks);
  const [toggleState, setToggleState] = useState<boolean>(false);

  const { onScreenSharingStopped } = props;

  useEffect(() => {
    tracksRef.current = tracks;
  }, [tracks]);

  useEffect(() => {
    if (error !== null) {
      console.error("An error occurred while sharing the screen.", error);
      onScreenSharingStopped();
    }
  }, [error, onScreenSharingStopped]);

  useEffect(() => {
    const init = async (channelName: string) => {
      if (!props.screenshareConfig) return;

      try {
        await screenVideoClient.join(
          props.screenshareConfig.appId,
          channelName,
          props.screenshareConfig.token,
          props.screenshareConfig.uid
        );
        const videoTrack = getScreenSharingVideoTrack(tracks);
        if (tracks) await screenVideoClient.publish(videoTrack);
      } catch (e) {
        console.error(e);
      }
    };

    if (props.screenshareConfig && ready && tracks && initialized) {
      init(props.screenshareConfig.channelName);
    }
  }, []);

  useEffect(() => {
    const videoTrack = getScreenSharingVideoTrack(tracks);
    if (videoTrack) {
      videoTrack.on("track-ended", () => {
        onScreenSharingStopped();
        stopScreenshare();
        setToggleState(false);
      });
    }
    // Stop and remove all tracks for screenshared client
    function stopScreenshare() {
      if (tracksRef.current) {
        const track = getScreenSharingVideoTrack(tracksRef.current);
        track.close();
        track.removeAllListeners();
      }
      (async () => {
        await screenVideoClient.leave();
        screenVideoClient.removeAllListeners();
      })();
    }
  }, [onScreenSharingStopped, tracks, screenVideoClient]);

  useEffect(() => {
    return () => {
      if (tracksRef.current) {
        const track = getScreenSharingVideoTrack(tracksRef.current);
        track.close();
        track.removeAllListeners();
      }
      (async () => {
        await screenVideoClient.leave();
        screenVideoClient.removeAllListeners();
      })();
    };
  }, []);

  useEffect(() => {
    console.log("스키린유저", props.users, props.vidDiv);
    // 화면공유를 위한 강제 렌더링이 필요함
    const screenShareUser = props.users.find((user) => !user.username);
    props.vidDiv.current &&
      props.playVideo(screenShareUser, props.vidDiv.current);

    return () => {
      props.vidDiv && props.stopVideo(screenShareUser, props.vidDiv.current);
    };
    // eslint-disable-next-line
  }, [props.users]);

  if (!ready) {
    return null;
  }

  // Toggle tracks for screenshared client
  if (toggleState) {
    // If on then turn it off
    if (initialized) return;
    if (tracksRef.current) {
      const track = getScreenSharingVideoTrack(tracksRef.current);
      track.close();
      track.removeAllListeners();
    }
    (async () => {
      await screenVideoClient.leave();
      screenVideoClient.removeAllListeners();
    })();
  } else {
    // If off then turn it on
    if (initialized) return;
    (async () => {
      await screenVideoClient.join(
        props.screenshareConfig.appId,
        props.screenshareConfig.channelName,
        props.screenshareConfig.token,
        props.screenshareConfig.uid
      );
      // Using the screen client hook
      if (!null) {
        const videoTrack = getScreenSharingVideoTrack(tracks);
        if (tracks) await screenVideoClient.publish(videoTrack);
      }
    })();
  }

  const videoTrack = getScreenSharingVideoTrack(tracks);

  return (
    // props.users && (
    <>
      {/* Agora video player for screenshare */}
      {/* <AgoraVideoPlayer className="video" videoTrack={videoTrack} /> */}

      {/* Toggle Screenshare Button */}
      <div id="screenshare-controls">
        <button
          onClick={() => setToggleState(!toggleState)}
          id="toggle-screenshare-btn"
        >
          {toggleState ? "Start Screen Sharing" : "Stop Screen Sharing"}
        </button>
      </div>
    </>
    // )
  );
};

export default ScreenSharing;