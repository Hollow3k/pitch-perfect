import React from "react";
import "./Header.css";
import { useNavigate } from "react-router-dom";

function Header(){
  const navigate = useNavigate();
  
  const Home = () => {
    navigate("/");
  };

  return(
    <><div className="header">
        <div className="logo" onClick={Home}>
          <h1 id="pitch">Pitch</h1>
          <h1 id="perfect">Perfect</h1>
        </div>
      </div></>
  )
};

export default Header;