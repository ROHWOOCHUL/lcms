import React, { ReactElement } from "react";

import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

const rotate = keyframes`
from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div<{
  width: number;
  mobileWidth: number;
  backgroundColor?: string;
}>`
  width: ${({ mobileWidth }) => mobileWidth + "px"};
  height: ${({ mobileWidth }) => mobileWidth + "px"};
  border-radius: 50%;
  border: ${({ backgroundColor }) =>
    `3px solid ${backgroundColor ? backgroundColor : "black"}`};
  border-right-color: transparent;
  transform-origin: center;
  animation: ${rotate} 1s linear infinite;
`;

interface Props {
  width: number;
  mobileWidth: number;
  backgroundColor?: string;
}

const Loader = (props: Props): ReactElement => {
  return (
    <Spinner
      width={props.width}
      mobileWidth={props.mobileWidth}
      backgroundColor={props.backgroundColor}
    />
  );
};

export default Loader;
