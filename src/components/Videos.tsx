import React, { useEffect, useRef } from "react";

import { User } from "../types";
import Video from "./Video";
import { useUsers } from "../GlobalContext";

const Videos = () => {
  const users = useUsers()[0];

  return (
    <div id="videos">
      {users.length &&
        users.map((user: User) => <Video key={user.uid} user={user} />)}
    </div>
  );
};

export default Videos;
