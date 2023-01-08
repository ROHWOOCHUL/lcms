// import AgoraRTC from "agora-rtc-sdk-ng";
import "../index.css";

import AgoraRTC, { AgoraVideoPlayer, UID } from "agora-rtc-react";
import AgoraRTM, { RtmMessage } from "agora-rtm-sdk";
import { ContentWrapper, Section } from "../components/Layouts/Layouts";
import {
  GlobalProvider,
  useAdmin,
  useClientContext,
  useStart,
  useUsers,
} from "../GlobalContext";
import { useRef, useState } from "react";

import ChannelForm from "../components/ChannelForm";
import { User } from "../types";
import Videos from "../components/Videos";

const HodooClass = () => {
  //Store the User Data
  const [users, setUsers] = useUsers();
  //Regulates the start of the video call
  const [start, setStart] = useStart();
  const client = useClientContext();
  //Whether you are the admin or not
  const admin = useAdmin();
  // const { ready, tracks } = useMicAndCamera();
  const [sharingScreen, setSharingScreen] = useState<boolean>(false);
  const [isVideoPlay, setIsVideoPlay] = useState<boolean>(false);
  const [isPraiseTriggered, setIsPraiseTriggered] = useState<boolean>(false);
  const [targetUserUid, setTargetUserUid] = useState<string>("");

  const init = async (
    channelName: string,
    appId: string,
    userName: string,
    admin: boolean
  ) => {
    try {
      // console.log(channelName, appId, userName, admin);
      client.current.rtc.client = AgoraRTC.createClient({
        mode: "rtc",
        codec: "vp8",
      });
      initClientEvents();

      let uid: UID = await client.current.rtc.client.join(
        appId,
        channelName,
        null,
        null
      );
      client.current.rtm.client = AgoraRTM.createInstance(appId);
      await client.current.rtm.client.login({ uid: uid.toString() });
      client.current.rtm.channel =
        await client.current.rtm.client.createChannel(channelName);
      await client.current.rtm.channel.join();
      initRtmEvents();
      const userObj: any = {};
      userObj[`${uid}`] = JSON.stringify({
        uid: uid,
        username: userName,
        admin: admin,
      });

      client.current.rtc.localAudioTrack =
        await AgoraRTC.createMicrophoneAudioTrack();
      client.current.rtc.localVideoTrack =
        await AgoraRTC.createCameraVideoTrack();
      // await client.current.rtm.client.clearChannelAttributes(channelName)
      await client.current.rtm.client.addOrUpdateChannelAttributes(
        channelName,
        userObj,
        { enableNotificationToChannelMembers: true }
      );

      //Adding a User to the Users State
      setUsers((prevUsers) => {
        return [
          ...prevUsers,
          {
            uid: uid,
            audio: true,
            video: true,
            client: true,
            videoTrack: client.current.rtc.localVideoTrack,
            admin: admin,
            username: userName,
          },
        ];
      });

      //Publishing your Streams
      await client.current.rtc.client.publish([
        client.current.rtc.localAudioTrack,
        client.current.rtc.localVideoTrack,
      ]);
      setStart(true);
    } catch (error) {
      console.log(error);
    }
  };

  let action = async (action: any) => {
    console.log(action);
    if (action.type === "leave") {
      // Destroy the local audio and video tracks.
      await client.current.rtc.localAudioTrack.stop();
      await client.current.rtc.localVideoTrack.stop();
      await client.current.rtm.client.deleteChannelAttributesByKeys(
        client.current.rtm.channel.channelId,
        [client.current.rtc.client.uid!.toString()]
      );
      await client.current.rtc.client.leave();
      await client.current.rtm.channel.leave();
      await client.current.rtm.client.logout();
      setUsers([]);
      setStart(false);
    } else if (action.type === "audio") {
      setUsers((prevUsers: User[]) => {
        return prevUsers.map((user) => {
          console.log(user);
          if (user.client) {
            if (action.type === "audio") {
              client.current.rtc.localAudioTrack.setEnabled(!user.audio);
              return { ...user, audio: !user.audio };
            }
          }
          return user;
        });
      });
    } else if (action.type === "video") {
      setUsers((prevUsers) => {
        // console.log(client.current.rtc.localAudioTrack.getVolumeLevel());
        return prevUsers.map((user) => {
          if (user.client) {
            client.current.rtc.localVideoTrack.setEnabled(!user.video);
            return { ...user, video: !user.video };
          }
          return user;
        });
      });

      client.current.rtc.localVideoTrack.getMediaStreamTrack().enabled =
        !client.current.rtc.localVideoTrack.getMediaStreamTrack().enabled;
    } else if (action.type === "video-share") {
      console.log("비디오 공유 옴");
      setSharingScreen(!sharingScreen);
    } else if (action.type === "video-trigger") {
      console.log("비디오 트리거 옴");
      setIsVideoPlay(true);
    } else if (action.type === "praise") {
      console.log("여기 왔어요");
      setTargetUserUid(action.targetUserUid);
      setIsPraiseTriggered(true);
    } else {
    }
  };

  const initRtmEvents = () => {
    client.current.rtm.client.on(
      "MessageFromPeer",
      async (message: RtmMessage, memberId: string) => {
        console.log(message);
        const type: string | undefined = JSON.parse(message.text).type;
        console.log(type);

        // if (message.text && JSON.parse(message.text).type === "praise") {
        //   setTargetUserUid(JSON.parse(message.text).targetUserUid);
        //   action("praise");
        //   return;
        // }
        if (!type) return;

        action(JSON.parse(message.text));
      }
    );

    client.current.rtm.channel.on("AttributesUpdated", (attr) => {
      console.log(attr);
      setUsers((prevUsers): any => {
        return prevUsers.map((User) => {
          if (User.username) {
            return User;
          } else {
            if (!User.uid) return;
            let usr = attr[User.uid]
              ? JSON.parse(attr[User.uid]?.value)
              : { username: "anonymous", admin: false };
            return { ...User, username: usr.username, admin: usr.admin };
          }
        });
      });
    });
  };

  const initClientEvents = () => {
    client.current.rtc.client.on("user-joined", async (user) => {
      setUsers((prevUsers): any => {
        return [...prevUsers, { uid: user.uid, client: false }];
      });
    });

    client.current.rtc.client.on("user-published", async (user, type) => {
      await client.current.rtc.client.subscribe(user, type);
      setUsers((prevUsers): any => {
        return prevUsers.map((User) => {
          if (User.uid === user.uid) {
            if (type === "video") {
              return {
                ...User,
                video: true,
                videoTrack: user.videoTrack,
              };
            } else if (type === "audio") {
              user.audioTrack && user.audioTrack.play();
              return { ...User, audio: user.hasAudio };
            }
          }
          return User;
        });
      });
    });

    client.current.rtc.client.on("user-left", async (user) => {
      let usrs = await client.current.rtm.client.getChannelAttributes(
        client.current.rtm.channel.channelId
      );
      console.log(usrs);
      setUsers((prevUsers) => {
        return prevUsers.filter((User) => User.uid !== user.uid);
      });
    });

    client.current.rtc.client.on("user-unpublished", (user, type) => {
      setUsers((prevUsers) => {
        return prevUsers.map((User) => {
          if (User.uid === user.uid) {
            if (type === "audio") {
              return { ...User, audio: user.hasAudio };
            } else if (type === "video") {
              return { ...User, video: user.hasVideo };
            }
          }
          return User;
        });
      });
    });

    client.current.rtc.client.on("connection-state-change", async (user) => {
      console.log("connection-state-change");
    });
  };

  return (
    <Section>
      <ContentWrapper>
        {start && (
          <Videos
            action={action}
            sharingScreen={sharingScreen}
            setSharingScreen={setSharingScreen}
            isVideoPlay={isVideoPlay}
            setIsVideoPlay={setIsVideoPlay}
            isPraiseTriggered={isPraiseTriggered}
            setIsPraiseTriggered={setIsPraiseTriggered}
            targetUserUid={targetUserUid}
            setTargetUserUid={setTargetUserUid}
          />
        )}
        {!start && <ChannelForm initFunc={init} />}
      </ContentWrapper>
    </Section>
  );
};

export default HodooClass;
