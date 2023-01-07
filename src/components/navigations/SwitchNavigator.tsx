import { BrowserRouter, Route, Routes } from "react-router-dom";

import HeaderLayout from "../Layouts/HeaderLayout";
import HodooClass from "../../pages/HodooClass";
import Main from "../../pages/Main";
import type { ReactElement } from "react";

function SwitchNavigator(): ReactElement {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HeaderLayout />}>
          <Route path="/" element={<Main />} />
          <Route path="/agora" element={<HodooClass />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default SwitchNavigator;
