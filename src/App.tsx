import {
  AgoraVideoPlayer,
  createClient,
  createMicrophoneAndCameraTracks,
} from "agora-rtc-react";
import {
  GlobalProvider,
  useAdmin,
  useClientContext,
  useStart,
  useUsers,
} from "./GlobalContext";
import { useRef, useState } from "react";

import AgoraRTM from "agora-rtm-sdk";
import ChannelForm from "./components/ChannelForm";
import Videos from "./components/Videos";

const useMicAndCamera = createMicrophoneAndCameraTracks();
const useClient = createClient({ mode: "rtc", codec: "vp8" });
const App = () => {
  //Store the User Data
  const [users, setUsers] = useUsers();
  //Regulates the start of the video call
  const [start, setStart] = useStart();
  //Contains the RTC and RTM data
  // const client = useRef({
  //   rtc: {
  //     // For the local client.
  //     client: null,
  //     // For the local audio and video tracks.
  //     localAudioTrack: null,
  //     localVideoTrack: null,
  //   },
  //   rtm: {
  //     client: null,
  //     channel: null,
  //   },
  // });
  const client = useClientContext();
  //Whether you are the admin or not
  const admin = useAdmin();
  // const { ready, tracks } = useMicAndCamera();
  const { ready, tracks } = useMicAndCamera();

  const init = async (channelName, appId, userName, admin) => {
    try {
      client.current.rtc.client = useClient();
      // console.log(channelName, appId, userName, admin);
      initClientEvents();

      client.current.rtm.client = AgoraRTM.createInstance(appId);
      await client.current.rtm.client.login({ uid: userName });
      client.current.rtm.channel =
        await client.current.rtm.client.createChannel(channelName);
      await client.current.rtm.channel.join();
      initRtmEvents();

      let uid = await client.current.rtc.client.join(
        appId,
        channelName,
        null,
        null
      );
      let obj = {};
      obj[`${uid}`] = JSON.stringify({
        uid: uid,
        username: userName,
        admin: admin,
      });

      // await client.current.rtm.client.clearChannelAttributes(channelName)
      await client.current.rtm.client.addOrUpdateChannelAttributes(
        channelName,
        obj,
        { enableNotificationToChannelMembers: true }
      );

      if (ready) {
        [
          client.current.rtc.localAudioTrack,
          client.current.rtc.localVideoTrack,
        ] = tracks;
        //Adding a User to the Users State
        setUsers((prevUsers) => {
          return [
            ...prevUsers,
            {
              uid: uid,
              audio: true,
              video: true,
              client: true,
              videoTrack: tracks[1],
              admin: admin,
              username: userName,
            },
          ];
        });

        //Publishing your Streams
        await client.current.rtc.client.publish([tracks[0], tracks[1]]);
        setStart(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  let action = async (action) => {
    if (action === "leave") {
      // Destroy the local audio and video tracks.
      await client.current.rtc.localAudioTrack.stop();
      await client.current.rtc.localVideoTrack.stop();
      await client.current.rtm.client.deleteChannelAttributesByKeys(
        client.current.rtm.channel.channelId,
        [client.current.rtc.client.uid.toString()]
      );
      await client.current.rtc.client.leave();
      await client.current.rtm.channel.leave();
      await client.current.rtm.client.logout();
      setUsers([]);
      setStart(false);
    } else if (action === "video") {
      setUsers((prevUsers) => {
        console.log(client.current.rtc.localAudioTrack.getVolumeLevel());
        return prevUsers.map((user) => {
          if (user.client) {
            if (action === "audio") {
              client.current.rtc.localAudioTrack.setEnabled(!user.audio);
              return { ...user, audio: !user.audio };
            } else if (action === "video") {
              client.current.rtc.localVideoTrack.setEnabled(!user.video);
              return { ...user, video: !user.video };
            }
          }
          return user;
        });
      });
    } else {
    }
  };

  const initRtmEvents = () => {
    client.current.rtm.client.on(
      "MessageFromPeer",
      async (message, memberId) => {
        let type = message.text;
        if (type === "audio" || type === "video") {
          action(type);
        } else if (type === "kick") {
          action("leave");
        }
      }
    );

    client.current.rtm.channel.on("AttributesUpdated", (attr) => {
      console.log(attr);
      setUsers((prevUsers) => {
        return prevUsers.map((User) => {
          if (User.username) {
            return User;
          } else {
            let usr = JSON.parse(attr[User.uid].value);
            return { ...User, username: usr.username, admin: usr.admin };
          }
        });
      });
    });
  };

  const initClientEvents = () => {
    client.current.rtc.client.on("user-joined", async (user) => {
      setUsers((prevUsers) => {
        return [...prevUsers, { uid: user.uid, client: false }];
      });
    });

    client.current.rtc.client.on("user-published", async (user, type) => {
      await client.current.rtc.client.subscribe(user, type);
      setUsers((prevUsers) => {
        return prevUsers.map((User) => {
          if (User.uid === user.uid) {
            if (type === "video") {
              return {
                ...User,
                video: user.hasVideo,
                videoTrack: user.videoTrack,
              };
            } else if (type === "audio") {
              user.audioTrack.play();
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
  };

  return (
    <div className="App">
      {start && <Videos action={action} />}
      {!start && <ChannelForm initFunc={init} admin={admin} />}
    </div>
  );
};

export default App;
