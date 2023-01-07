import "../App.css";

import { ContentWrapper, Section } from "../components/Layouts/Layouts";
import React, { useState } from "react";

import Config from "../config/app-env";
import { device } from "../theme";
import reactLogo from "../assets/react.svg";
import { useMediaQuery } from "react-responsive";

const Main = () => {
  const [count, setCount] = useState(0);
  const isDesktop = useMediaQuery({
    query: device.desktop,
  });

  const isTablet = useMediaQuery({
    query: device.tablet,
  });
  return (
    <Section>
      <ContentWrapper>
        <div>
          <a href="https://vitejs.dev" target="_blank">
            <img src="/vite.svg" className="logo" alt="Vite logo" />
          </a>
          <a href="https://reactjs.org" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1>{Config.ENV ? `${Config.ENV} Environment` : "undefined"}</h1>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
          <p>Web for LCMS</p>
        </div>
        <p className="read-the-docs">LCMS</p>
      </ContentWrapper>
    </Section>
  );
};

export default Main;
