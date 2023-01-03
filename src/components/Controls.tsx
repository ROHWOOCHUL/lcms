import AgoraRTC, { ILocalAudioTrack, ILocalVideoTrack } from "agora-rtc-sdk-ng";
import React, { ReactElement, useRef, useState } from "react";
import { useClient, useStart, useUsers } from "../GlobalContext";

import { User } from "../types";

interface Props {
  user: User;
  vidDiv: any;
}

const Controls = (props: Props) => {
  const [sharingScreen, setSharingScreen] = useState<boolean>(false);
  const setStart = useStart()[1];
  const setUsers = useUsers()[1];
  const rtc = useClient();
  const localScreenTracks = useRef<
    ILocalVideoTrack | [ILocalVideoTrack, ILocalAudioTrack] | null | any
  >(null);
  const leaveChannel = async () => {
    // Destroy the local audio and video tracks.
    await rtc.current.localAudioTrack.close();
    await rtc.current.localVideoTrack.close();
    await rtc.current.client.leave();
    setUsers([]);
    setStart(false);
  };

  const mute = (type: "video" | "audio", id: string) => {
    if (type === "audio") {
      setUsers((prevUsers: User[]) => {
        return prevUsers.map((user) => {
          if (user.uid === id) {
            user.client && rtc.current.localAudioTrack.setEnabled(!user.audio);
            return { ...user, audio: !user.audio };
          }
          return user;
        });
      });
    } else if (type === "video") {
      setUsers((prevUsers: User[]) => {
        return prevUsers.map((user) => {
          if (user.uid === id) {
            user.client && rtc.current.localVideoTrack.setEnabled(!user.video);
            return { ...user, video: !user.video };
          }
          return user;
        });
      });
    }
  };

  const toggleScreen = async () => {
    if (!sharingScreen) {
      setSharingScreen(true);
      shareScreen();
    } else {
      setSharingScreen(false);
      stopShareScreen();
    }
  };

  // 화면 공유는 사운드가 없는 것 같다.
  const shareScreen = async () => {
    // local 환경에서 커스텀 불가능 ??
    // {
    //   encoderConfig: {
    //     width: { min: 640, max: 1920 },
    //     height: { min: 480, max: 1080 },
    //   },
    // },
    // "enable"
    localScreenTracks.current = await AgoraRTC.createScreenVideoTrack(
      {
        // encoderConfig: {
        //   width: { min: 640, max: 1920 },
        //   height: { min: 480, max: 1080 },
        // },
      },
      "enable"
    );

    // Video 비활성화
    props.user.videoTrack.stop();
    // 화면공유 화면 실행
    localScreenTracks.current.play(props.vidDiv.current);

    //스크린 공유 종료 이벤트 리스너
    // 이벤트 종료 리스너는 스크린 공유를 선언한 위치에서만 선언할 수 있다. (왜 그런지는 모름)
    localScreenTracks.current.on("track-ended", async () => {
      console.log("트래킹 종료");
      stopShareScreen();
      setSharingScreen(false);
    });
    await rtc.current.client.unpublish(rtc.current.localVideoTrack);
    await rtc.current.client.publish([localScreenTracks.current]);

    // document.querySelector(".agora_video_player").style.objectFit = "contain";
    // console.log(document.querySelector(".agora_video_player"));
  };

  const stopShareScreen = async (): Promise<void> => {
    console.log("화면 공유 중지", localScreenTracks.current);
    // 화면공유 화면 비활성화
    localScreenTracks.current &&
      localScreenTracks.current.stop(props.vidDiv.current);
    // Video 활성화
    props.user.videoTrack.play(props.vidDiv.current);

    await rtc.current.client.unpublish([localScreenTracks.current]);
    await rtc.current.client.publish([
      rtc.current.localAudioTrack,
      rtc.current.localVideoTrack,
    ]);
  };

  const localPlayerStart = async () => {
    // Create an audio track from a source file
    const track = await AgoraRTC.createBufferSourceAudioTrack({
      source:
        "https://static.hodooenglish.com/hodooSchool/levelTest/SplashHodoo.mp3",
    });

    track.startProcessAudioBuffer({ loop: false });
    track.play();
    rtc.current.client.publish(track);
  };

  return (
    <div className="controls" style={{ width: "100%" }}>
      {
        <p
          className={props.user.audio ? "on" : ""}
          onClick={() => props.user.client && mute("audio", props.user.uid)}
        >
          Mic
        </p>
      }
      {
        <p
          className={props.user.video ? "on" : ""}
          onClick={() => props.user.client && mute("video", props.user.uid)}
        >
          Video
        </p>
      }
      {props.user.client && (
        <div
          style={{
            height: "30px",
            backgroundColor: "tomato",
            color: "white",
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "5px",
            fontSize: "13px",
            borderRadius: "50px",
            fontWeight: 500,
          }}
          onClick={toggleScreen}
        >
          {sharingScreen ? "화면 공유 / 종료" : "화면 공유 / 시작"}
        </div>
      )}
      <div style={{ display: "flex" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            marginRight: "10px",
          }}
        >
          <label
            style={{ color: "white", fontSize: "14px", marginBottom: "8px" }}
          >
            Local Audio Level
          </label>
          <input
            type="range"
            min="0"
            id="localAudioVolume"
            max="100"
            step="1"
            onChange={(e) => {
              console.log("Volume of local audio :" + e.target.value);
              // Set the local audio volume.
              rtc.current.localAudioTrack.setVolume(parseInt(e.target.value));
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <label
            style={{ color: "white", fontSize: "14px", marginBottom: "8px" }}
          >
            Remote Audio Level
          </label>
          <input
            type="range"
            min="0"
            id="remoteAudioVolume"
            max="100"
            step="1"
            onChange={(e) => {
              console.log("Volume of remote audio :" + e.target.value);
              // Set the remote audio volume.
              localScreenTracks.current.remoteAudioTrack.setVolume(
                parseInt(e.target.value)
              );
            }}
          />
        </div>
      </div>
      {
        <button
          type="button"
          id="playAudioFile"
          onClick={localPlayerStart}
          style={{
            height: "40px",
            border: "none",
            padding: "10px",
            backgroundColor: "tomato",
            color: "white",
            borderRadius: "50px",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Play audio file
        </button>
      }
      {props.user.client && <p onClick={() => leaveChannel()}>나가기</p>}
    </div>
  );
};

export default Controls;
