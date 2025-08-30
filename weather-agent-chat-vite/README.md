# Weather Agent Chat (React + Vite)

Quick Start

```bash
# 1) Extract the zip
cd weather-agent-chat-vite

# 2) Install deps
npm install

# 3) Start dev server
npm run dev
```



## ✨ Features (per assignment)
- User messages right, agent left
- Streaming response display
- Auto scroll to latest
- Loading/disabled states, error banner
- Clear chat
- Responsive, keyboard Enter to send, Shift+Enter for newline
- Thread management via `threadId` (roll number)

##  API
POST `https://millions-screeching-vultur.mastra.cloud/api/agents/weatherAgent/stream`  
Headers and body exactly as in the PDF spec. The app reads the response body as a stream and renders chunks in real time.

## Tech
- React 18 + Vite
- No CSS frameworks; handcrafted CSS to match the clean, modern style
- Small custom hook `useWeatherAgent` to encapsulate API details

## 🧪 Sample prompts
- What's the weather in London?
- Will it rain tomorrow in Mumbai?
- Weather forecast for next week

## 📝 Notes
- If your network blocks streaming, you will still receive the final message; chunks might arrive at once.
- You can adapt styling to exactly match provided Figma if needed.
- Known limitation: we don't persist threads across reloads (keep it in-memory).

