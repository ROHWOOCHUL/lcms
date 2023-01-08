import React, { useEffect, useRef, useState } from "react";
import { useAdmin, useClientContext } from "../GlobalContext";

import AgoraRTC from "agora-rtc-sdk-ng";
import Controls from "./Controls";
import { User } from "../types";

interface Props {
  user: User;
  action: (type: string) => void;
  sharingScreen: boolean;
  setSharingScreen: (bool: boolean) => void;
  sharingDiv: any;
  isVideoPlay: boolean;
  setIsVideoPlay: (bool: boolean) => void;
}

export const Video = (props: Props) => {
  const vidDiv = useRef<HTMLDivElement>(null);
  const client = useClientContext();
  const admin = useAdmin();

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
    </div>
  );
};

export default Video;
