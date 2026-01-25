import React, { useState } from 'react';
import { Conversation } from '@elevenlabs/client';
import Header from "./HEader";
import { Orb } from "./orb";
import "./PitchRoom.css";

export const PitchRoom = () => {

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
      const response = await fetch(`http://localhost:3000/api/get-pitch-token?investor=${investor}`);
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

  const getTranscript = async () => {
    const response = await fetch('http://localhost:3000/api/get-conversation-id');
  }

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
    </div>
    </>
  );
};