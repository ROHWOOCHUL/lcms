import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useAdmin, useClientContext, useUsers } from "../GlobalContext";

import { AgoraVideoPlayer } from "agora-rtc-react";
import Controls from "./Controls";
import ScreenSharing from "./ScreenSharing";
import Video from "./Video";
import { motion } from "framer-motion";

interface Props {
  action: () => Promise<void>;
  sharingScreen: boolean;
  setSharingScreen: (bool: boolean) => void;
  isVideoPlay: boolean;
  setIsVideoPlay: (bool: boolean) => void;
}
const Videos = (props: Props) => {
  const users = useUsers()[0];
  const admin = useAdmin();
  const sharingDiv = useRef<HTMLDivElement>(null);
  const vidDiv = useRef(null);
  const screenshareConfig: any = useMemo(() => {
    return {
      appId: "f964fae738a94dda88c3c54438449f49",
      channelName: "test72019490",
      token: null,
      uid: null,
    };
  }, []);

  const onScreenSharingStopped = useCallback(() => {
    console.log("Screensharing stopped.");
  }, []);

  useEffect(() => {
    console.log("유저리스트다", users);
    console.log(
      "얘가 스크린공유",
      users.find((user) => !user.audio)
    );
  }, [users]);

  const playVideo = (user, vidDiv) => {
    console.log("하..", user, vidDiv);
    user && vidDiv && user.videoTrack && user.videoTrack.play(vidDiv);
  };

  const stopVideo = (user, vidDiv) => {
    user && vidDiv && user.videoTrack && user.videoTrack.stop();
  };

  useEffect(() => {
    if (!admin.current) {
      // 화면공유를 위한 강제 렌더링이 필요함
      const screenShareUser = users.find((user) => !user.username);
      vidDiv.current && playVideo(screenShareUser, vidDiv.current);

      return () => {
        vidDiv && stopVideo(screenShareUser, vidDiv.current);
      };
    }
  }, [users]);

  return (
    <div id="videos" style={{ display: "flex", flexDirection: "column" }}>
      {props.sharingScreen && admin.current && (
        <ScreenSharing
          sharingScreen={props.sharingScreen}
          screenshareConfig={screenshareConfig}
          onScreenSharingStopped={onScreenSharingStopped}
          vidDiv={vidDiv}
          users={users}
          playVideo={playVideo}
          stopVideo={stopVideo}
        />
      )}
      <motion.div
        initial={{ height: "0px" }}
        animate={{
          width: "100%",
          height:
            props.sharingScreen && users.find((user) => !user.audio)?.videoTrack
              ? "300px"
              : "0px",
        }}
        className="vid"
        ref={vidDiv}
      />
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          justifyContent: "flex-start",
        }}
      >
        {users.length &&
          users.map((user) => {
            if (user.videoTrack && user.username) {
              return (
                <div className="user-container" key={user.uid}>
                  {user.client && user.admin && <p>You(Admin)</p>}
                  {user.client && !user.admin && <p>You(User)</p>}
                  {user.admin && !user.client && <p>{user.username} (Admin)</p>}
                  {!user.client && !user.admin && <p>{user.username} (User)</p>}
                  {/* {user.videoTrack && (
                  // <div style={{width: '95%', height: '95%'}} ref={vidDiv}>
                  <AgoraVideoPlayer
                    ref={vidDiv}
                    className="vid"
                    videoTrack={user.videoTrack}
                  ></AgoraVideoPlayer>
                  // </div>
                )} */}
                  <Video
                    key={user.uid}
                    user={user}
                    action={props.action}
                    sharingScreen={props.sharingScreen}
                    setSharingScreen={props.setSharingScreen}
                    isVideoPlay={props.isVideoPlay}
                    setIsVideoPlay={props.setIsVideoPlay}
                    sharingDiv={sharingDiv}
                  />
                  {/* <Controls user={user} action={props.action} vidDiv={vidDiv} /> */}
                </div>
              );
            } else {
              return <div></div>;
            }
          })}
      </div>
    </div>
  );
};

export default Videos;
