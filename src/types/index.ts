import {
  IAgoraRTCClient,
  ICameraVideoTrack,
  ILocalAudioTrack,
  ILocalVideoTrack,
  IMicrophoneAudioTrack,
  UID,
} from "agora-rtc-sdk-ng";
import { RtmChannel, RtmClient } from "agora-rtm-sdk";

export interface User {
  uid?: UID;
  admin: boolean;
  audio: boolean;
  video: boolean;
  client: boolean;
  videoTrack: ICameraVideoTrack;
  username: string;
}

export interface Client {
  rtc: {
    // For the local client.
    client: IAgoraRTCClient;
    // For the local audio and video tracks.
    localAudioTrack: IMicrophoneAudioTrack;
    localVideoTrack: ICameraVideoTrack;
  };
  rtm: {
    client: RtmClient;
    channel: RtmChannel;
  };
}
