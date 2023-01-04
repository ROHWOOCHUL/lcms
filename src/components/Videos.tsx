import React, { useEffect, useRef } from "react";

import { AgoraVideoPlayer } from "agora-rtc-react";
import Controls from "./Controls";
import { useUsers } from "../GlobalContext";

interface Props {
  action: () => Promise<void>;
}
const Videos = (props: Props) => {
  const users = useUsers()[0];
  return (
    <div id="videos">
      {users.length &&
        users.map((user) => {
          if (user.videoTrack) {
            return (
              <div className="user-container" key={user.uid}>
                {user.client && user.admin && <p>You(Admin)</p>}
                {user.client && !user.admin && <p>You(User)</p>}
                {user.admin && !user.client && <p>{user.username} (Admin)</p>}
                {!user.client && !user.admin && <p>{user.username} (User)</p>}
                {user.videoTrack && (
                  <AgoraVideoPlayer
                    className="vid"
                    videoTrack={user.videoTrack}
                  ></AgoraVideoPlayer>
                )}
                <Controls user={user} action={props.action} />
              </div>
            );
          } else {
            return <div></div>;
          }
        })}
    </div>
  );
};

export default Videos;
