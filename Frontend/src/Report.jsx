import React from "react";
import Header from "./Header";

async function showReport() {
  try{
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/get-conversation-id`);
    const { conversation_id } = await response.json();
    console.log("Conversation ID:", conversation_id);
    const transcriptResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/get-transcript?conversation_id=${conversation_id}`);
    const transcriptData = await transcriptResponse.json();
    for(let i=0; i<transcriptData.length; i++){
      console.log(`${transcriptData[i].role}: ${transcriptData[i].message}`);
    }
  } catch(err){
    console.error('Failed to fetch report:', err);
  }
}
function Report(){
  return(
    <div>
      <Header></Header>
      <button onClick={showReport}>Show report</button>
    </div>
  )
}

export default Report;