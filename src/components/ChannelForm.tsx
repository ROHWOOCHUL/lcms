import React, { useState } from "react";

import Loader from "./Loader";
import { useLoading } from "../GlobalContext";

const ChannelForm = ({
  initFunc,
}: {
  initFunc: (channelName: string, appId: string) => void;
}) => {
  const APP_ID = "f964fae738a94dda88c3c54438449f49";
  const [channelName, setChannelName] = useState("");
  const [appId, setappId] = useState(APP_ID);
  const isLoading = useLoading()[0];
  return (
    <form className="join">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          marginBottom: "20px",
        }}
      >
        <label
          htmlFor="appid"
          style={{ marginBottom: "10px", color: "white", fontWeight: 500 }}
        >
          AppID
        </label>
        <input
          type="text"
          id="appid"
          placeholder="Enter App Id"
          defaultValue={APP_ID}
          onChange={(e) => {
            setappId(e.target.value);
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          marginBottom: "20px",
        }}
      >
        <label
          htmlFor="channelname"
          style={{ marginBottom: "10px", color: "white", fontWeight: 500 }}
        >
          Channel Name
        </label>
        <input
          type="text"
          id="channelname"
          placeholder="Enter Channel Name"
          onChange={(e) => setChannelName(e.target.value)}
        />
      </div>
      <button
        disabled={isLoading}
        onClick={(e) => {
          e.preventDefault();
          initFunc(channelName, appId);
        }}
      >
        {isLoading ? (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Loader width={24} mobileWidth={24} backgroundColor={"#5a42f5"} />
            </div>
          </>
        ) : (
          "Video Call 접속"
        )}
      </button>
    </form>
  );
};

export default ChannelForm;
