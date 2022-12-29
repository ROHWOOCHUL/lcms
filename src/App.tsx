import "./App.css";

import Config from "./config/app-env";
import reactLogo from "./assets/react.svg";
import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
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
    </div>
  );
}

export default App;
