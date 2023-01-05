import React, { useEffect, useRef } from "react";

import { AgoraVideoPlayer } from "agora-rtc-react";
import Controls from "./Controls";
import Video from "./Video";
import { motion } from "framer-motion";
import { useUsers } from "../GlobalContext";

interface Props {
  action: () => Promise<void>;
  sharingScreen: boolean;
  setSharingScreen: (bool: boolean) => void;
}
const Videos = (props: Props) => {
  const users = useUsers()[0];
  const sharingDiv = useRef<HTMLDivElement>(null);
  return (
    <div id="videos" style={{ display: "flex", flexDirection: "column" }}>
      <motion.div
        style={{ width: "100%" }}
        animate={{ height: props.sharingScreen ? "500px" : "0px" }}
        ref={sharingDiv}
      ></motion.div>
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
            if (user.videoTrack) {
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
