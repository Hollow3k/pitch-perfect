import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());

app.get('/api/get-pitch-token', async (req, res) => {

  const investor = req.query.investor;

  console.log("Investor selected:", investor);

  const agentid = {
    'CFO': process.env.ELEVENLABS_AGENT_ID_CFO,
    'CTO': process.env.ELEVENLABS_AGENT_ID_CTO,
    'VF': process.env.ELEVENLABS_AGENT_ID_VF,
    'NA': process.env.ELEVENLABS_AGENT_ID_NA,
    'IB': process.env.ELEVENLABS_AGENT_ID_IB
  }[investor];

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=${agentid}`,
      {
        method: 'GET',
        headers: {
          'xi-api-key': process.env.ELEVENLABS_API_KEY,
        },
      }
    );

    if (!response.ok) throw new Error('Failed to fetch token');
    
    const data = await response.json();
    console.log(data);
    res.json({ token: data.token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



app.get('/api/get-conversation-id', async (req, res) => {
    try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversations?agent_id=${agentid}&page_size=1`,
      {
        method: 'GET',
        headers: {
          'xi-api-key': process.env.ELEVENLABS_API_KEY,
        },
      }
    );

    if (!response.ok) throw new Error('Failed to fetch token');
    
    const data = await response.json();
    const conversation_id = data.conversations.conversation_id;
    res.json(data.conversations.conversation_id);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.get('/api/get-transcript', async (req, res) => {
    try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversations/${conversation_id}`,
      {
        method: 'GET',
        headers: {
          'xi-api-key': process.env.ELEVENLABS_API_KEY,
        },
      }
    );

    if (!response.ok) throw new Error('Failed to fetch token');
    
    const data = await response.json();
    const transcript = data.transcript;
    console.log(transcript);
    res.json(transcript);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.listen(3000);