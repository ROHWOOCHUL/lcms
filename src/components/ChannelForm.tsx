import React, { useState } from "react";
import { useAdmin, useLoading, useStart, useUsers } from "../GlobalContext";

import Loader from "./Loader";

interface Props {
  initFunc: (
    channelName: string,
    appId: string,
    userName: string,
    admin: boolean
  ) => Promise<void>;
}
const ChannelForm = (props: Props) => {
  const [channelName, setChannelName] = useState("test72019490");
  const [appId, setappId] = useState("f964fae738a94dda88c3c54438449f49");
  const [userName, setUsername] = useState("aa");
  const [start, setStart] = useStart();
  const admin = useAdmin();
  return (
    <form className="join">
      <input
        type="text"
        value={appId}
        placeholder="Enter App Id"
        onChange={(e) => {
          setappId(e.target.value);
        }}
      />
      <input
        type="text"
        placeholder="Enter Channel Name"
        value={channelName}
        onChange={(e) => setChannelName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter Username"
        value={userName}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="radio"
        name="Role"
        id=""
        onClick={() => (admin.current = true)}
      />
      Admin
      <input
        type="radio"
        name="Role"
        id=""
        onClick={() => (admin.current = false)}
      />
      User
      <button
        onClick={(e) => {
          e.preventDefault();
          props.initFunc(channelName, appId, userName, admin.current);
        }}
      >
        Join Call
      </button>
    </form>
  );
};

export default ChannelForm;
