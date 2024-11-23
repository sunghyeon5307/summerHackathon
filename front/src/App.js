import "./App.css";
import Navi from "./navi";
import { Route, Routes } from "react-router-dom";
import Baljin from "./baljin";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navi />} />
      <Route path="/balgin" element={<Baljin />} />
    </Routes>
  );
}

export default App;
