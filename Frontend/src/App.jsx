import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PitchRoom from "./PitchRoom.jsx";
import LandingPage from "./LandingPage";
import Choose from "./Choose";
import "./App.css";
import Report from "./Report.jsx";

function App(){
  return(
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/choose" element={<Choose />} />
        <Route path="/PitchRoom" element={<PitchRoom />} />
        <Route path="*" element={<LandingPage />} />
        <Route path="/report" element={<Report />} />
      </Routes>
    </Router>
  )
}

export default App;