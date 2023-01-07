import { MainContainer, MainContentContainer } from "./Layouts";

import { Outlet } from "react-router-dom";
import React from "react";

const HeaderLayout = () => {
  return (
    <MainContainer>
      <MainContentContainer>
        <Outlet />
      </MainContentContainer>
    </MainContainer>
  );
};

export default HeaderLayout;
