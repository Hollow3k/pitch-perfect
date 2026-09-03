# PitchPerfect

**Live Demo: [pitchperfect.angad.social](https://pitchperfect.angad.social)**

PitchPerfect is an AI-powered pitch training platform that lets startup founders practice their investor pitches in real-time voice conversations with AI investor personas. After each session, users receive a detailed performance report with scores and actionable feedback.

## What It Does

1. **Choose an Investor Persona** — Pick from 5 distinct AI investors, each with unique questioning styles:
   - The Skeptical CFO (focuses on financials and unit economics)
   - The Performative CTO (grills you on technical stack and scalability)
   - The Visionary Founder (judges your mission and long-term vision)
   - The Nitpicker Analyst (tests precision and data consistency)
   - The Impatient Billionaire (demands concise bottom-line answers)

2. **Live Voice Pitch Session** — Enter a real-time voice conversation powered by ElevenLabs Conversational AI. The AI listens, interrupts, and challenges your pitch just like a real investor would.

3. **AI-Generated Report** — After ending your pitch, receive a structured feedback report including:
   - Overall score (1-10)
   - Strengths and areas for improvement
   - Metric breakdowns (clarity, persuasiveness, preparedness, response quality)
   - Investor-type fit assessment
   - Detailed coaching advice
   - Full conversation transcript

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                        Frontend                          │
│               (React + Vite, hosted on Vercel)           │
│                                                         │
│  LandingPage → Choose Investor → PitchRoom → Report     │
│                                    │                     │
│                          WebRTC voice session             │
│                          (ElevenLabs client SDK)          │
└──────────────────────────┬──────────────────────────────┘
                           │ REST API calls
┌──────────────────────────▼──────────────────────────────┐
│                        Backend                           │
│              (Express.js, hosted on Render)               │
│                                                         │
│  /api/get-pitch-token  → fetches session token from      │
│                          ElevenLabs API                   │
│                                                         │
│  /api/generate-report  → fetches transcript from         │
│                          ElevenLabs, sends to Groq       │
│                          for AI analysis                  │
└────────────┬───────────────────────────┬────────────────┘
             │                           │
┌────────────▼────────────┐  ┌───────────▼───────────────┐
│     ElevenLabs API       │  │        Groq API            │
│                          │  │                            │
│  - Conversational AI     │  │  - Qwen 3.6 27B model     │
│  - WebRTC voice sessions │  │  - Pitch report generation │
│  - Transcript storage    │  │                            │
└──────────────────────────┘  └────────────────────────────┘
```

## Tech Stack

| Layer        | Technology                          |
|-------------|-------------------------------------|
| Frontend    | React, Vite, React Router           |
| Styling     | CSS (custom, no framework)          |
| Voice AI    | ElevenLabs Conversational AI (WebRTC) |
| Backend     | Node.js, Express.js                 |
| Report Gen  | Groq API (Qwen 3.6 27B)            |
| Frontend Hosting | Vercel                         |
| Backend Hosting  | Render                         |

## Environment Variables

### Backend (`Backend/.env`)
```
ELEVENLABS_API_KEY=
ELEVENLABS_AGENT_ID_CFO=
ELEVENLABS_AGENT_ID_CTO=
ELEVENLABS_AGENT_ID_VF=
ELEVENLABS_AGENT_ID_NA=
ELEVENLABS_AGENT_ID_IB=
GROQ_API_KEY=
```

### Frontend (`Frontend/.env`)
```
VITE_BACKEND_URL=http://localhost:3001
```

## Running Locally

```bash
# Backend
cd Backend
npm install
node index.js

# Frontend (in a separate terminal)
cd Frontend
npm install
npm run dev
```
