import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useAdmin, useClientContext, useUsers } from "../GlobalContext";

import { AgoraVideoPlayer } from "agora-rtc-react";
import Controls from "./Controls";
import ScreenSharing from "./ScreenSharing";
import Video from "./Video";
import { motion } from "framer-motion";
import styled from "@emotion/styled";

interface Props {
  action: () => Promise<void>;
  sharingScreen: boolean;
  setSharingScreen: (bool: boolean) => void;
  isVideoPlay: boolean;
  setIsVideoPlay: (bool: boolean) => void;
}

const UserContainer = styled.div`
  width: 100%;
  margin-right: 30px;

  &:last-of-type {
    margin-right: 0px;
  }
`;

const SharingScreenDiv = styled(motion.div)`
  video {
    object-fit: cover !important;
  }
`;

const UserLabel = styled.p`
  color: white;
`;
const Videos = (props: Props) => {
  const users = useUsers()[0];
  const admin = useAdmin();
  const sharingDiv = useRef<HTMLDivElement>(null);
  const vidDiv = useRef(null);
  const activeUsers = useRef([]);

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
    console.log("얘도 발생함 ??");
    user && vidDiv && user.videoTrack && user.videoTrack.stop();
  };

  useEffect(() => {
    console.log(
      "여기서 문제 발생함",
      admin.current,
      users.find((user) => !user.username || user.username === "anonymous"),
      vidDiv.current
    );
    activeUsers.current = users.filter(
      (user) => !user.username || user.username !== "anonymous"
    );
    if (!admin.current) {
      // 화면공유를 위한 강제 렌더링이 필요함
      const screenShareUser = users.find(
        (user) => !user.username || user.username === "anonymous"
      );
      if (screenShareUser) props.setSharingScreen(true);
      vidDiv.current && playVideo(screenShareUser, vidDiv.current);

      // return () => {
      //   vidDiv && stopVideo(screenShareUser, vidDiv.current);
      // };
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
      <SharingScreenDiv
        initial={{ height: "0px" }}
        animate={{
          width: "100%",
          height:
            props.sharingScreen &&
            // 화면 공유 전용 유저가 있는지 확인
            users.find(
              (user) => !user.username || user.username === "anonymous"
            )?.videoTrack
              ? "1000px"
              : "0px",
        }}
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
            if (
              user.videoTrack &&
              user.username &&
              user.username !== "anonymous"
            ) {
              return (
                <UserContainer
                  style={{ marginRight: activeUsers.length === 1 ? "0px" : "" }}
                  className="user-container"
                  key={user.uid}
                >
                  {user.client && user.admin && (
                    <UserLabel>You(Admin)</UserLabel>
                  )}
                  {user.client && !user.admin && (
                    <UserLabel>You(User)</UserLabel>
                  )}
                  {user.admin && !user.client && (
                    <UserLabel>{user.username} (Admin)</UserLabel>
                  )}
                  {!user.client && !user.admin && (
                    <UserLabel>{user.username} (User)</UserLabel>
                  )}
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
                </UserContainer>
              );
            } else {
              return null;
            }
          })}
      </div>
    </div>
  );
};

export default Videos;
