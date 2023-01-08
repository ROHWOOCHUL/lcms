import {
  ILocalAudioTrack,
  ILocalVideoTrack,
  createClient,
  createScreenVideoTrack,
} from "agora-rtc-react";
import { ReactElement, RefObject, useEffect, useRef, useState } from "react";

import { User } from "../types";

const useScreenVideoClient = createClient({
  mode: "rtc",
  codec: "vp8",
});

interface Props {
  screenShareConfig: any;
  sharingScreen: boolean;
  vidDiv: RefObject<HTMLDivElement>;
  users: User[];
  playVideo: (user: User, vidDiv: HTMLDivElement) => void;
  stopVideo: (user: User, vidDiv: HTMLDivElement) => void;
}
const ScreenSharing = (props: Props): ReactElement | null => {
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

  useEffect(() => {
    tracksRef.current = tracks;
  }, [tracks]);

  useEffect(() => {
    const init = async (channelName: string) => {
      if (!props.screenShareConfig) return;

      try {
        await screenVideoClient.join(
          props.screenShareConfig.appId,
          channelName,
          props.screenShareConfig.token,
          props.screenShareConfig.uid
        );
        const videoTrack = getScreenSharingVideoTrack(tracks);
        if (tracks) await screenVideoClient.publish(videoTrack);
      } catch (e) {
        console.error(e);
      }
    };

    if (props.screenShareConfig && ready && tracks) {
      init(props.screenShareConfig.channelName);
    }
  }, []);

  useEffect(() => {
    const videoTrack = getScreenSharingVideoTrack(tracks);
    if (videoTrack) {
      videoTrack.on("track-ended", () => {
        stopScreenShare();
        setToggleState(false);
      });
    }
    const stopScreenShare = () => {
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
  }, [tracks, screenVideoClient]);

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
      screenShareUser &&
      props.playVideo(screenShareUser, props.vidDiv.current);
  }, [props.users]);

  if (!ready) {
    return null;
  }

  if (toggleState) {
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
    (async () => {
      await screenVideoClient.join(
        props.screenShareConfig.appId,
        props.screenShareConfig.channelName,
        props.screenShareConfig.token,
        props.screenShareConfig.uid
      );
      if (!null) {
        const videoTrack = getScreenSharingVideoTrack(tracks);
        if (tracks) await screenVideoClient.publish(videoTrack);
      }
    })();
  }

  return <></>;
};

export default ScreenSharing;
