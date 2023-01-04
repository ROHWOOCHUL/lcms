import { FaMicrophone, FaVideo } from "react-icons/fa";
import { useAdmin, useClientContext } from "../GlobalContext";
import { useEffect, useRef, useState } from "react";

import { MdMonitor } from "react-icons/md";
import { User } from "../types";
import { createScreenVideoTrack } from "agora-rtc-react";

interface Props {
  user: User;
  vidDiv: any;
  action: () => Promise<void>;
}

const Controls = ({ user, action }) => {
  const [sharingScreen, setSharingScreen] = useState<boolean>(false);
  const admin = useAdmin();
  const client = useClientContext();
  const localScreenTracks = useRef<any>(null);
  // localScreenTracks.current = createScreenVideoTrack({});
  const useScreenVideoTrack = createScreenVideoTrack({});
  const { ready, tracks, error } = useScreenVideoTrack();
  const muteMaster = (type) => {
    if (user.client) {
      action(type);
    } else {
      if (admin.current) {
        messageMaster(type);
      }
    }
  };

  useEffect(() => {
    if (sharingScreen) {
      shareScreen();
    } else {
      stopShareScreen();
    }
  }, [sharingScreen]);

  const messageMaster = (type) => {
    console.log(type);
    client.current.rtm.client.sendMessageToPeer({ text: type }, user.username);
  };

  const buildClassName = (type) => {
    let str = "";
    str += type === "audio" && user.audio ? "on " : "";
    str += type === "video" && user.video ? "on " : "";
    str += !admin.current && !user.client ? "noClick" : "";
    return str;
  };

  // 화면 공유는 사운드가 없는 것 같다.
  const shareScreen = async () => {
    console.log(tracks);
    // local 환경에서 커스텀 불가능 ??
    // {
    //   encoderConfig: {
    //     width: { min: 640, max: 1920 },
    //     height: { min: 480, max: 1080 },
    //   },
    // },
    // "enable"

    // Video 비활성화
    user.videoTrack.stop();
    // 화면공유 화면 실행
    localScreenTracks.current.play(tracks);

    //스크린 공유 종료 이벤트 리스너
    // 이벤트 종료 리스너는 스크린 공유를 선언한 위치에서만 선언할 수 있다. (왜 그런지는 모름)
    localScreenTracks.current.on("track-ended", async () => {
      console.log("트래킹 종료");
      stopShareScreen();
      setSharingScreen(false);
    });
    await client.rtc.current.client.unpublish(
      client.rtc.current.localVideoTrack
    );
    await client.rtc.current.client.publish([localScreenTracks.current]);

    // document.querySelector(".agora_video_player").style.objectFit = "contain";
    // console.log(document.querySelector(".agora_video_player"));
  };

  const stopShareScreen = async (): Promise<void> => {
    console.log("화면 공유 중지", localScreenTracks.current);
    // 화면공유 화면 비활성화
    localScreenTracks.current &&
      localScreenTracks.current.stop(user.videoTrack);
    // Video 활성화
    user.videoTrack.play(user.videoTrack);

    await client.rtc.current.client.unpublish([localScreenTracks.current]);
    await client.rtc.current.client.publish([
      client.rtc.current.localAudioTrack,
      client.rtc.current.localVideoTrack,
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
      {
        <p className={buildClassName("video")} onClick={toggleScreen}>
          <MdMonitor />
        </p>
      }
      {admin.current && !user.client ? (
        <p onClick={() => messageMaster("kick")}>Kick</p>
      ) : (
        ""
      )}
      {user.client && <p onClick={() => action("leave")}>Quit</p>}
    </div>
  );
};

export default Controls;
