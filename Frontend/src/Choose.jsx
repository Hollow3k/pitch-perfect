import React from "react";
import "./Choose.css";
import { useNavigate } from "react-router-dom";
import Header from "./HEader";
function Choose(){
  const navigate = useNavigate();
  
  const handleCFO = () => {
    navigate("/PitchRoom?investor=CFO");
  };
  
  const handleCTO = () => {
    navigate("/PitchRoom?investor=CTO");
  };
  
  const handleVF = () => {
    navigate("/PitchRoom?investor=VF");
  };

  const handleNA = () => {
    navigate("/PitchRoom?investor=NA");
  };

  const handleIB = () => {
    navigate("/PitchRoom?investor=IB");
  };

  return(
    <>
      <Header></Header>
      <div className="container">
        <h1 className="main-heading">Choose <span className="yellow-text">investor</span> persona</h1>
        <div className="row1">
          <button onClick={handleCFO} className="choice-button">The skeptical CFO</button>
          <button onClick={handleCTO} className="choice-button">The Performative CTO</button>
          <button onClick={handleVF} className="choice-button">The Visionary Founder</button></div>
        <div className="row2">
          <button onClick={handleNA} className="choice-button">The Nitpicker Analyst</button>
          <button onClick={handleIB} className="choice-button">The Impatient Billionaire</button>
        </div>
      </div>
    </>
  )
}

export default Choose;