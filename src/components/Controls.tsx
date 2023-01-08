import AgoraRTC, { UID } from "agora-rtc-react";
import { FaMicrophone, FaVideo } from "react-icons/fa";
import {
  useAdmin,
  useClientContext,
  useLocalScreenTack,
  useUsers,
} from "../GlobalContext";

import { MdMonitor } from "react-icons/md";
import { RefObject } from "react";
import { User } from "../types";
import { colors } from "../theme";

interface Props {
  user: User;
  vidDiv: RefObject<HTMLDivElement>;
  action: (type: any) => void;
  sharingScreen: boolean;
  setSharingScreen: (bool: boolean) => void;
  setIsVideoPlay: (bool: boolean) => void;
  setIsPraiseTriggered: (bool: boolean) => void;
  setTargetUserUid: (uid: UID) => void;
}

const Controls = (props: Props) => {
  const admin = useAdmin();
  const client = useClientContext();
  const users = useUsers()[0];

  const localScreenTracks = useLocalScreenTack();
  const muteMaster = (type: string) => {
    if (props.user.client) {
      props.action(JSON.parse(type));
    } else {
      if (admin.current) {
        messageMaster(type);
      }
    }
  };

  const messageVideoTrigger = (type: string, src: string) => {
    console.log(type, props.user, client);
    // if (props.user.client) {
    // props.action({ type, src });
    props.user.uid &&
      users.forEach((user) => {
        user.uid &&
          client.current.rtm.client.sendMessageToPeer(
            {
              text: `{"type":"${type}","targetUserUid":"${src}"}`,
            },
            user.uid.toString()
          );
      });
    props.action(JSON.parse(`{"type":"${type}","targetUserUid":"${src}"}`));
    // }
  };
  const localPlayerStart = async () => {
    // Create an audio track from a source file
    const track = await AgoraRTC.createBufferSourceAudioTrack({
      source:
        "https://static.hodooenglish.com/hodooSchool/levelTest/SplashHodoo.mp3",
    });

    track.startProcessAudioBuffer({ loop: false });
    track.play();
    client.current.rtc.client.publish(track);
  };
  const messagePraiseTrigger = (type: string, targetUserUid?: UID) => {
    props.user.uid &&
      users.forEach((user) => {
        user.uid &&
          client.current.rtm.client.sendMessageToPeer(
            { text: `{"type":"praise","targetUserUid":${targetUserUid}}` },
            user.uid.toString()
          );
      });
    props.setIsPraiseTriggered(true);
    targetUserUid && props.setTargetUserUid(targetUserUid);
    localPlayerStart();
  };

  const messageMaster = (type: string) => {
    props.user.uid &&
      client.current.rtm.client.sendMessageToPeer(
        { text: type },
        props.user.uid.toString()
      );
  };

  const messageVideoShare = (type: string, uid: UID) => {
    client.current.rtm.client.sendMessageToPeer({ text: type }, uid.toString());
  };

  const buildClassName = (type: string) => {
    let str = "";
    // console.log(client.current.rtc.localVideoTrack, type);
    str += type === "audio" && props.user.audio ? "on " : "";
    str += type === "video" && props.user.video ? "on " : "";
    // str += type === "audio" && props.user.audio ? "on " : "";
    // str +=
    //   type === "video" &&
    //   (client.current.rtc.localVideoTrack.getMediaStreamTrack().enabled ||
    //     props.user.video)
    //     ? "on "
    //     : "";
    client.current.rtc.localVideoTrack.getMediaStreamTrack().enabled;
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
      console.log("시작");
      // ac  = await AgoraRTC.join(uid:)
      console.log("어드민의 UID는 ?:", users);
      // localScreenTracks.current = await AgoraRTC.createScreenVideoTrack({});
      console.log("나는 아고라 알티씨", AgoraRTC);

      // Video 비활성화
      // props.user.videoTrack.stop();
      // 화면공유 화면 실행

      // localScreenTracks.current.play(props.sharingDiv.current);

      //스크린 공유 종료 이벤트 리스너
      // 이벤트 종료 리스너는 스크린 공유를 선언한 위치에서만 선언할 수 있다. (왜 그런지는 모름)
      // localScreenTracks.current.on("track-ended", async () => {
      //   console.log("트래킹 종료");
      //   stopShareScreen();
      //   props.setSharingScreen(false);
      // });

      props.setSharingScreen(true);
      users.forEach((user) => {
        user.uid && messageVideoShare("video-share", user.uid);
      });

      // document.querySelector(".agora_video_player").style.objectFit = "contain";
      // console.log(document.querySelector(".agora_video_player"));
    } catch (error) {
      console.log(error);
    }
  };

  const stopShareScreen = async (): Promise<void> => {
    console.log("화면 공유 중지", localScreenTracks.current);
    // 화면공유 화면 비활성화
    // localScreenTracks.current &&
    //   localScreenTracks.current.stop(props.sharingDiv.current);
    // // Video 활성화
    // // props.user.videoTrack.play(props.sharingDiv.current);

    // await client.current.rtc.client.unpublish([localScreenTracks.current]);
    // await client.current.rtc.client.publish([
    //   client.current.rtc.localAudioTrack,
    //   client.current.rtc.localVideoTrack,
    // ]);
    users.forEach((user) => {
      user.uid && messageVideoShare("video-share", user.uid);
    });
    props.setSharingScreen(false);
  };

  const toggleScreen = async () => {
    if (!props.sharingScreen) {
      shareScreen();
    } else {
      stopShareScreen();
    }
  };

  // useEffect(() => {
  //   if (!admin.current) {
  //     if (!props.sharingScreen) {
  //       shareScreen();
  //     } else {
  //       stopShareScreen();
  //     }
  //   }
  // }, [props.sharingScreen]);

  return (
    <div className="controls">
      {
        <p
          className={buildClassName("audio")}
          onClick={() => muteMaster(`{"type":"audio"}`)}
        >
          <FaMicrophone />
        </p>
      }
      {
        <p
          className={buildClassName("video")}
          onClick={() => muteMaster(`{"type":"video"}`)}
        >
          <FaVideo />
          <span>
            {client.current.rtc.localVideoTrack.getMediaStreamTrack().enabled
              ? "on"
              : "off"}
          </span>
        </p>
      }
      {admin.current && props.user.client && (
        <p className={buildClassName("video")} onClick={toggleScreen}>
          <MdMonitor />
        </p>
      )}
      {admin.current && props.user.client && (
        <p
          style={{ backgroundColor: "white", color: colors.gray100 }}
          onClick={() =>
            messageVideoTrigger(
              "video-trigger",
              "https://static.hodooenglish.com/hds/hds_mainvideo.mp4"
            )
          }
        >
          비디오 실행
        </p>
      )}
      {admin.current && !props.user.client && (
        <p
          style={{ backgroundColor: "white", color: colors.gray100 }}
          onClick={() => messagePraiseTrigger("praise", props.user.uid)}
        >
          얘 칭찬
        </p>
      )}
      {admin.current && !props.user.client ? (
        <p onClick={() => messageMaster(`{"type":"leave"}`)}>Kick</p>
      ) : (
        ""
      )}
      {props.user.client && (
        <p onClick={() => props.action({ type: "leave" })}>Quit</p>
      )}
    </div>
  );
};

export default Controls;
