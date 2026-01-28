import React, { useState } from 'react';
import { Conversation } from '@elevenlabs/client';
import Header from "./Header.jsx";
import { Orb } from "./orb";
import "./PitchRoom.css";
import { useNavigate } from 'react-router-dom';


const PitchRoom = () => {

  const navigate = useNavigate();
  const getReport = () => {
    navigate(`/report?investor=${investor}`);
  };

  const url = new URL(window.location.href);
  const investor = url.searchParams.get("investor");

  const [conversation, setConversation] = useState(null);
  const [status, setStatus] = useState('Disconnected');
  const [agentState, setAgentState] = useState(null);

  const startPitch = async () => {
    try {
      // 1. Request microphone access
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // 2. Get the secure token from your MERN backend
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/get-pitch-token?investor=${investor}`);
      const { token } = await response.json();

      // 3. Start the session
      const conv = await Conversation.startSession({
        conversationToken: token,
        connectionType: 'webrtc',
        onConnect: () => setStatus('Connected'),
        onDisconnect: () => setStatus('Disconnected'),
        onError: (err) => console.error('AI Error:', err),
        onModeChange: (mode) => setAgentState(mode.mode) // 'speaking' or 'listening'
      });

      setConversation(conv);
    } catch (err) {
      console.error('Failed to start pitch:', err);
    }
  };

  const endPitch = async () => {
    if (conversation) {
      await conversation.endSession();
      setConversation(null);
    }
  };


  return (
    <>
    <Header></Header>
    <div className="pitchroom-container">
      <Orb agentState={agentState} className="orb-class" colors= {conversation ? ["#36e900", "#ffffff"] : ["#e90000", "#ffffff"]}></Orb>
      <button 
        onClick={conversation ? endPitch : startPitch}
        className="button-pitchroom"
      >
        {conversation ? 'End Pitch Session' : 'Start Pitch Session'}
      </button> 
      
      <button 
        onClick={getReport}
        className="button-pitchroom"
      >
        Get Report
      </button>
    </div>
    </>
  );
};


export default PitchRoom;