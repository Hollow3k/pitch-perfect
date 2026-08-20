import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';
import Groq from 'groq-sdk';

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const app = express();

app.use(cors());

function getAgentId(investor) {
  return {
    'CFO': process.env.ELEVENLABS_AGENT_ID_CFO,
    'CTO': process.env.ELEVENLABS_AGENT_ID_CTO,
    'VF': process.env.ELEVENLABS_AGENT_ID_VF,
    'NA': process.env.ELEVENLABS_AGENT_ID_NA,
    'IB': process.env.ELEVENLABS_AGENT_ID_IB
  }[investor];
}

app.get('/api/get-pitch-token', async (req, res) => {

  const investor = req.query.investor;

  console.log("Investor selected:", investor);

  const agentid = getAgentId(investor);

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
      `https://api.elevenlabs.io/v1/convai/conversations`,
      {
        method: 'GET',
        headers: {
          'xi-api-key': process.env.ELEVENLABS_API_KEY,
        },
      }
    );

    if (!response.ok) throw new Error('Failed to fetch token');
    
    const data = await response.json();
    const conversation_id = data.conversations[0].conversation_id;
    res.json({ conversation_id: conversation_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.get('/api/get-transcript', async (req, res) => {
    try {

    const conversation_id = req.query.conversation_id;
    
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


app.get('/api/generate-report', async (req, res) => {
  try {
    const investor = req.query.investor;

    // Give ElevenLabs a moment to process the ended conversation
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 1. Get the most recent conversation ID
    const convoResponse = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversations`,
      {
        method: 'GET',
        headers: {
          'xi-api-key': process.env.ELEVENLABS_API_KEY,
        },
      }
    );

    if (!convoResponse.ok) throw new Error('Failed to fetch conversations');
    const convoData = await convoResponse.json();
    
    if (!convoData.conversations || convoData.conversations.length === 0) {
      throw new Error('No conversations found');
    }
    
    const conversation_id = convoData.conversations[0].conversation_id;
    console.log('Generating report for conversation:', conversation_id);

    // 2. Get the transcript (retry up to 3 times with delay)
    let transcript = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      const transcriptResponse = await fetch(
        `https://api.elevenlabs.io/v1/convai/conversations/${conversation_id}`,
        {
          method: 'GET',
          headers: {
            'xi-api-key': process.env.ELEVENLABS_API_KEY,
          },
        }
      );

      if (!transcriptResponse.ok) throw new Error('Failed to fetch transcript');
      const transcriptData = await transcriptResponse.json();
      
      if (transcriptData.transcript && transcriptData.transcript.length > 0) {
        transcript = transcriptData.transcript;
        break;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    if (!transcript || transcript.length === 0) {
      throw new Error('Transcript not available yet. Please try again in a moment.');
    }

    // 3. Format transcript into readable text
    let transcriptText = '';
    for (let i = 0; i < transcript.length; i++) {
      const role = transcript[i].role === 'agent' ? 'Investor' : 'Pitcher';
      transcriptText += `${role}: ${transcript[i].message}\n`;
    }

    // 4. Generate report using Groq
    const investorLabels = {
      'CFO': 'Chief Financial Officer',
      'CTO': 'Chief Technology Officer',
      'VF': 'Venture Capital Firm Partner',
      'NA': 'Angel Investor',
      'IB': 'Investment Banker'
    };

    const investorLabel = investorLabels[investor] || 'Investor';

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are an expert pitch coach who evaluates startup pitches. You provide structured, actionable feedback. Always respond in valid JSON format with the following structure:
{
  "overallScore": <number 1-10>,
  "summary": "<2-3 sentence overall assessment>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "improvements": ["<improvement 1>", "<improvement 2>", "<improvement 3>"],
  "investorFit": "<1-2 sentences about how well the pitch matched the investor type>",
  "keyMetrics": {
    "clarity": <number 1-10>,
    "persuasiveness": <number 1-10>,
    "preparedness": <number 1-10>,
    "responseQuality": <number 1-10>
  },
  "detailedFeedback": "<A paragraph of detailed coaching advice>"
}`
        },
        {
          role: 'user',
          content: `Analyze this pitch conversation between a startup founder and a ${investorLabel}. Evaluate how well the pitcher performed and provide structured feedback.\n\nTranscript:\n${transcriptText}`
        }
      ],
      model: 'qwen/qwen3.6-27b',
      temperature: 0.7,
      max_tokens: 4096,
    });

    const rawContent = chatCompletion.choices[0].message.content;
    // Strip <think>...</think> tags that reasoning models add
    const jsonContent = rawContent.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
    const report = JSON.parse(jsonContent);
    res.json({ report, transcript: transcriptText });

  } catch (error) {
    console.error('Report generation error:', error);
    res.status(500).json({ error: error.message });
  }
});


app.listen(3001, () => {
  console.log('Backend running on http://localhost:3001');
});