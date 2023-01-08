import { useEffect, useRef } from "react";

import Controls from "./Controls";
import { UID } from "agora-rtc-sdk-ng";
import { User } from "../types";
import { colors } from "../theme";

interface Props {
  user: User;
  action: (type: string) => void;
  sharingScreen: boolean;
  setSharingScreen: (bool: boolean) => void;
  sharingDiv: any;
  isVideoPlay: boolean;
  setIsVideoPlay: (bool: boolean) => void;
  isPraiseTriggered: boolean;
  setIsPraiseTriggered: (bool: boolean) => void;
  targetUserUid: UID;
  setTargetUserUid: (uid: UID) => void;
}

export const Video = (props: Props) => {
  const vidDiv = useRef<HTMLDivElement>(null);

  const playVideo = () => {
    vidDiv.current && props.user.videoTrack.play(vidDiv.current);
  };

  const stopVideo = () => {
    props.user.videoTrack.stop();
  };

  useEffect(() => {
    console.log(props.user, props.user.client);
    // 화면공유를 위한 강제 렌더링이 필요함
    playVideo();

    return () => {
      stopVideo();
    };
    // eslint-disable-next-line
  }, [props.user]);

  useEffect(() => {
    if (props.isPraiseTriggered) {
      setTimeout(() => {
        props.setTargetUserUid("");
        props.setIsPraiseTriggered(false);
      }, 3000);
    }
  }, [props.isPraiseTriggered]);

  return (
    <div className="vid" ref={vidDiv}>
      {props.user.client && (
        <div
          style={{
            width: "80px",
            height: "80px",
            position: "absolute",
            top: "-12px",
            left: "-12px",
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "48px",
            zIndex: 9999,
            backgroundColor: "tomato",
            color: "white",
            fontWeight: 700,
          }}
        >
          Me
        </div>
      )}
      <Controls
        user={props.user}
        action={props.action}
        vidDiv={vidDiv}
        sharingScreen={props.sharingScreen}
        setSharingScreen={props.setSharingScreen}
        setIsVideoPlay={props.setIsVideoPlay}
        setIsPraiseTriggered={props.setIsPraiseTriggered}
        setTargetUserUid={props.setTargetUserUid}
      />
      {props.isVideoPlay && (
        <video
          style={{
            position: "absolute",
            width: "300px",
            height: "300px",
            top: "0px",
            left: "0px",
          }}
          controls
          muted
          loop
          playsInline
          autoPlay
        >
          <source
            src={`https://static.hodooenglish.com/hds/hds_mainvideo.mp4`}
          />
        </video>
      )}
      {props.isPraiseTriggered && props.user.uid === props.targetUserUid && (
        <h2
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            fontSize: "32px",
            color: colors.white,
            fontWeight: 700,
            transform: "translate(-50%,-120%)",
            zIndex: 99999,
          }}
        >
          잘했다.
        </h2>
      )}
    </div>
  );
};

export default Video;
