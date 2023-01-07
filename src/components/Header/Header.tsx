import { NavLink } from "react-router-dom";
import React from "react";
import { colors } from "../../theme";
import styled from "@emotion/styled";
const HeaderContainer = styled.div`
  width: 100%;
  height: 80px;
  background-color: white;
`;
const HeaderWrapper = styled.div`
  height: 100%;
  padding: 0px 30px;
  display: flex;
  align-items: center;
`;

const StyledNavLinks = styled(NavLink)`
  color: ${colors.gray100};
  font-size: 32px;
  text-decoration: none;
  margin-right: 28px;
  cursor: pointer;
`;
const Header = () => {
  return (
    <HeaderContainer>
      <HeaderWrapper>
        <StyledNavLinks to={"/"}>메인</StyledNavLinks>
        <StyledNavLinks to={"/agora"}>호두 클래스</StyledNavLinks>
      </HeaderWrapper>
    </HeaderContainer>
  );
};

export default Header;