import { useAdmin, useUsers } from "../GlobalContext";
import { useEffect, useMemo, useRef } from "react";

import ScreenSharing from "./ScreenSharing";
import { UID } from "agora-rtc-sdk-ng";
import { User } from "../types";
import Video from "./Video";
import { motion } from "framer-motion";
import styled from "@emotion/styled";

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

interface Props {
  action: (action: string) => Promise<void>;
  sharingScreen: boolean;
  setSharingScreen: (bool: boolean) => void;
  isVideoPlay: boolean;
  setIsVideoPlay: (bool: boolean) => void;
  isPraiseTriggered: boolean;
  setIsPraiseTriggered: (bool: boolean) => void;
  targetUserUid: UID;
  setTargetUserUid: (uid: UID) => void;
}
const Videos = (props: Props) => {
  const users = useUsers()[0];
  const admin = useAdmin();
  const sharingDiv = useRef<HTMLDivElement>(null);
  const vidDiv = useRef<HTMLDivElement>(null);
  const activeUsers = useRef<User[]>([]);

  const screenShareConfig: any = useMemo(() => {
    return {
      appId: "f964fae738a94dda88c3c54438449f49",
      channelName: "test72019490",
      token: null,
      uid: null,
    };
  }, []);

  const playVideo = (user: User, vidDiv: HTMLDivElement) => {
    user && vidDiv && user.videoTrack && user.videoTrack.play(vidDiv);
  };

  const stopVideo = (user: User, vidDiv: HTMLDivElement) => {
    user && vidDiv && user.videoTrack && user.videoTrack.stop();
  };

  useEffect(() => {
    activeUsers.current = users.filter(
      (user) => !user.username || user.username !== "anonymous"
    );
    if (!admin.current) {
      // 화면공유를 위한 강제 렌더링이 필요함
      const screenShareUser = users.find(
        (user) => !user.username || user.username === "anonymous"
      );
      if (screenShareUser) {
        props.setSharingScreen(true);
        vidDiv.current && playVideo(screenShareUser, vidDiv.current);
      }

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
          screenShareConfig={screenShareConfig}
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
                  style={{
                    marginRight: activeUsers.current.length === 1 ? "0px" : "",
                  }}
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
                  <Video
                    key={user.uid}
                    user={user}
                    action={props.action}
                    sharingScreen={props.sharingScreen}
                    setSharingScreen={props.setSharingScreen}
                    isVideoPlay={props.isVideoPlay}
                    setIsVideoPlay={props.setIsVideoPlay}
                    sharingDiv={sharingDiv}
                    isPraiseTriggered={props.isPraiseTriggered}
                    setIsPraiseTriggered={props.setIsPraiseTriggered}
                    targetUserUid={props.targetUserUid}
                    setTargetUserUid={props.setTargetUserUid}
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
