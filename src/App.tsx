import AgoraRTC, {
  IAgoraRTCRemoteUser,
  IRemoteAudioTrack,
} from "agora-rtc-sdk-ng";
import {
  GlobalProvider,
  useClient,
  useLoading,
  useStart,
  useUsers,
} from "./GlobalContext";

import ChannelForm from "./components/ChannelForm";
import { User } from "./types";
import Videos from "./components/Videos";

const App = () => {
  return (
    <GlobalProvider>
      <Content />
    </GlobalProvider>
  );
};

const Content = () => {
  const setUsers = useUsers()[1];
  const [start, setStart] = useStart();
  const [isLoading, setIsLoading] = useLoading();
  const rtc = useClient();
  const options = {
    // Pass your app ID here.
    appId: "f964fae738a94dda88c3c54438449f49",
    // Set the channel name.
    channel: "1949",
    // Pass a token if your project enables the App Certificate.
    token: null,
  };

  const init = async (name: string, appId: string) => {
    try {
      setIsLoading(true);
      rtc.current.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
      initClientEvents();
      const uid = await rtc.current.client.join(
        appId,
        name,
        options.token,
        null
      );
      rtc.current.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      rtc.current.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
      setUsers((prevUsers: User[]) => {
        return [
          ...prevUsers,
          {
            uid: uid,
            audio: true,
            video: true,
            client: true,
            videoTrack: rtc.current.localVideoTrack,
          },
        ];
      });
      await rtc.current.client.publish([
        rtc.current.localAudioTrack,
        rtc.current.localVideoTrack,
      ]);
      setStart(true);
      setIsLoading(false);
    } catch (error) {
      window.alert(JSON.stringify(error));
      setIsLoading(false);
    }
  };

  const initClientEvents = () => {
    rtc.current.client.on(
      "user-published",
      async (user: IAgoraRTCRemoteUser, mediaType: "video" | "audio") => {
        // New User Enters
        await rtc.current.client.subscribe(user, mediaType);

        if (mediaType === "video") {
          const remoteVideoTrack = user.videoTrack;
          setUsers((prevUsers: User[]) => {
            return [
              ...prevUsers,
              {
                uid: user.uid,
                audio: user.hasAudio,
                video: user.hasVideo,
                client: false,
                videoTrack: remoteVideoTrack,
              },
            ];
          });
        }

        if (mediaType === "audio") {
          const remoteAudioTrack: IRemoteAudioTrack | undefined =
            user.audioTrack;
          remoteAudioTrack?.play();
          setUsers((prevUsers: User[]) => {
            return prevUsers.map((User) => {
              if (User.uid === user.uid) {
                return { ...User, audio: user.hasAudio };
              }
              return User;
            });
          });
        }
      }
    );

    rtc.current.client.on(
      "user-unpublished",
      (user: IAgoraRTCRemoteUser, mediaType: "video" | "audio") => {
        //User Leaves
        if (mediaType === "audio") {
          setUsers((prevUsers: User[]) => {
            return prevUsers.map((User) => {
              if (User.uid === user.uid) {
                return { ...User, audio: !User.audio };
              }
              return User;
            });
          });
        }
        if (mediaType === "video") {
          setUsers((prevUsers: User[]) => {
            return prevUsers.filter((User) => User.uid !== user.uid);
          });
        }
      }
    );
  };

  return (
    <div className="App">
      {start && <Videos />}
      {!start && <ChannelForm initFunc={init} />}
    </div>
  );
};

export default App;
