import React from "react";
import Header from "./Header";

async function showReport() {
  try{
    const response = await fetch(`http://localhost:3000/api/get-conversation-id`);
    const conversationId = await response;
    console.log("Conversation ID:", conversationId);
    const transcriptResponse = await fetch(`http://localhost:3000/api/get-transcript?conversation_id=${conversationId}`);
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