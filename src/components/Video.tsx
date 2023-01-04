import React, { useEffect, useRef, useState } from "react";

import AgoraRTC from "agora-rtc-sdk-ng";
import Controls from "./Controls";
import { User } from "../types";
import { useClientContext } from "../GlobalContext";

interface Props {
  //   sharingScreen: boolean;
  //   setSharingScreen: (bool: boolean) => void;
  user: User;
  action: (type: string) => void;
}

export const Video = (props: Props) => {
  const vidDiv = useRef(null);
  const client = useClientContext();

  const playVideo = () => {
    props.user.videoTrack.play(vidDiv.current);
  };

  const stopVideo = () => {
    props.user.videoTrack.stop();
  };

  useEffect(() => {
    console.log(props.user);
    playVideo();

    return () => {
      stopVideo();
    };
    // eslint-disable-next-line
  }, []);

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
        // user={props.user}
        //       vidDiv={vidDiv}
        user={props.user}
        action={props.action}
        vidDiv={vidDiv}
      />
    </div>
  );
};

export default Video;
