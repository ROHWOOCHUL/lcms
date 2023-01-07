import { MainContainer, MainContentContainer } from "./Layouts";

import Header from "../Header/Header";
import { Outlet } from "react-router-dom";
import React from "react";

const HeaderLayout = () => {
  return (
    <MainContainer>
      <MainContentContainer>
        <Header />
        <Outlet />
      </MainContentContainer>
    </MainContainer>
  );
};

export default HeaderLayout;
