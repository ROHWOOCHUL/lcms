import AgoraRTC, { ILocalAudioTrack, ILocalVideoTrack } from "agora-rtc-react";
import { FaMicrophone, FaVideo } from "react-icons/fa";
import { useAdmin, useClientContext } from "../GlobalContext";
import { useEffect, useRef, useState } from "react";

import { MdMonitor } from "react-icons/md";
import { User } from "../types";

interface Props {
  user: User;
  vidDiv: any;
  action: () => void;
}

const Controls = (props: Props) => {
  const [sharingScreen, setSharingScreen] = useState<boolean>(false);
  const admin = useAdmin();
  const client = useClientContext();
  const localScreenTracks = useRef<
    ILocalVideoTrack | [ILocalVideoTrack, ILocalAudioTrack] | null | any
  >(null);
  // localScreenTracks.current = createScreenVideoTrack({});
  // const useScreenVideoTrack = createScreenVideoTrack({});
  // const { ready, tracks, error } = useScreenVideoTrack();
  const muteMaster = (type) => {
    if (props.user.client) {
      props.action(type);
    } else {
      if (admin.current) {
        messageMaster(type);
      }
    }
  };

  const messageMaster = (type) => {
    console.log(type, props.user, client);
    client.current.rtm.client.sendMessageToPeer(
      { text: type },
      props.user.uid.toString()
    );
  };

  const buildClassName = (type) => {
    let str = "";
    // console.log(client.current.rtc.localVideoTrack, type);
    // str += type === "audio" && props.user.audio ? "on " : "";
    // str += type === "video" && props.user.video ? "on " : "";
    str += type === "audio" && props.user.audio ? "on " : "";
    str +=
      type === "video" &&
      client.current.rtc.localVideoTrack._originMediaStreamTrack.enabled
        ? "on "
        : "";
    client.current.rtc.localVideoTrack._originMediaStreamTrack.enabled;
    str += !admin.current && !props.user.client ? "noClick" : "";
    return str;
  };

  // 화면 공유는 사운드가 없는 것 같다.
  const shareScreen = async () => {
    try {
      // local 환경에서 커스텀 불가능 ??
      // {
      //   encoderConfig: {
      //     width: { min: 640, max: 1920 },
      //     height: { min: 480, max: 1080 },
      //   },
      // },
      // "enable"
      localScreenTracks.current = await AgoraRTC.createScreenVideoTrack({});

      // Video 비활성화
      props.user.videoTrack.stop();
      // 화면공유 화면 실행
      console.log(
        "여기는 ??",
        props.user.videoTrack,
        props.vidDiv.current,
        localScreenTracks.current
      );
      localScreenTracks.current.play(props.vidDiv.current);

      //스크린 공유 종료 이벤트 리스너
      // 이벤트 종료 리스너는 스크린 공유를 선언한 위치에서만 선언할 수 있다. (왜 그런지는 모름)
      localScreenTracks.current.on("track-ended", async () => {
        console.log("트래킹 종료");
        stopShareScreen();
        setSharingScreen(false);
      });
      console.log(client.current.rtc.client.unpublish);
      await client.current.rtc.client.unpublish(
        client.current.rtc.localVideoTrack
      );
      console.log(localScreenTracks.current);
      await client.current.rtc.client.publish([localScreenTracks.current]);

      // document.querySelector(".agora_video_player").style.objectFit = "contain";
      // console.log(document.querySelector(".agora_video_player"));
    } catch (error) {
      console.log(error);
    }
  };

  const stopShareScreen = async (): Promise<void> => {
    console.log("화면 공유 중지", localScreenTracks.current);
    // 화면공유 화면 비활성화
    localScreenTracks.current &&
      localScreenTracks.current.stop(props.user.videoTrack);
    // Video 활성화
    props.user.videoTrack.play(props.user.videoTrack);

    await client.current.rtc.client.unpublish([localScreenTracks.current]);
    await client.current.rtc.client.publish([
      client.current.rtc.localAudioTrack,
      client.current.rtc.localVideoTrack,
    ]);
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

  return (
    <div className="controls">
      {
        <p
          className={buildClassName("audio")}
          onClick={() => muteMaster("audio")}
        >
          <FaMicrophone />
        </p>
      }
      {
        <p
          className={buildClassName("video")}
          onClick={() => muteMaster("video")}
        >
          <FaVideo />
        </p>
      }
      {props.user.client && (
        <p className={buildClassName("video")} onClick={toggleScreen}>
          <MdMonitor />
        </p>
      )}
      {admin.current && !props.user.client ? (
        <p onClick={() => messageMaster("kick")}>Kick</p>
      ) : (
        ""
      )}
      {props.user.client && <p onClick={() => props.action("leave")}>Quit</p>}
    </div>
  );
};

export default Controls;
