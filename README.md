# Spur AI Support Agent

A mini AI customer support chat widget built for the Spur founding full-stack engineer take-home assignment.

The app simulates a live support chat experience where users can ask store-related questions, the backend persists the conversation, and a Google Gemini model replies using conversation history plus a small fictional store knowledge base.

## Live Deployment

- Frontend: `https://spur-aichatagent.vercel.app/`
- Backend: `https://spur-chat-agent-xheo.onrender.com`
- Health check: `https://spur-chat-agent-xheo.onrender.com/health`

The frontend is deployed on Vercel and the backend is deployed on Render.

Render free-tier services can sleep after inactivity. To reduce cold starts, a cron job pings the backend health endpoint every 14 minutes. A cold start may still happen occasionally.

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Axios

### Backend

- Node.js
- Express
- TypeScript
- Prisma
- PostgreSQL

### LLM

- Google Gemini
- Model: `gemini-3.1-flash-lite`

## Features

- Floating live chat widget
- Clear user and AI message styling
- Scrollable message list
- Auto-scroll to the latest message
- Enter-to-send support
- Disabled send button while a request is in flight
- Loading/typing state while waiting for the AI reply
- Session-based chat history using `localStorage`
- Conversation and message persistence in PostgreSQL
- FAQ/domain knowledge included in the LLM prompt
- Friendly fallback response when the LLM/API fails
- Backend validation for empty and very long messages

## Architecture

```text
Next.js Frontend
  -> Express API
  -> Chat Service
  -> LLM Service
  -> Google Gemini

Express API
  -> Prisma
  -> PostgreSQL
```

The LLM call is wrapped behind `LLMService`, so the model/provider can be changed without rewriting the route or UI logic.

## API

### `GET /health`

Returns a simple health response for deployment checks and cron pings.

```json
{
  "status": "ok"
}
```

### `POST /chat/message`

Sends a user message to the backend, persists it, generates an AI reply, persists the reply, and returns the reply with the conversation session ID.

Request:

```json
{
  "message": "What is your return policy?",
  "sessionId": "optional-existing-session-id"
}
```

Response:

```json
{
  "reply": "You can return items within 30 days.",
  "sessionId": "conversation-session-id"
}
```

Validation:

- `message` is required.
- Empty messages are rejected.
- Messages longer than 5000 characters are rejected.

### `GET /chat/:sessionId`

Fetches the persisted message history for a conversation.

Example response:

```json
[
  {
    "id": "message-id",
    "conversationId": "conversation-session-id",
    "sender": "USER",
    "content": "What is your return policy?",
    "createdAt": "2026-06-07T10:00:00.000Z"
  },
  {
    "id": "message-id",
    "conversationId": "conversation-session-id",
    "sender": "AI",
    "content": "Returns are accepted within 30 days.",
    "createdAt": "2026-06-07T10:00:01.000Z"
  }
]
```

## Model And Limits

- LLM provider: Google Gemini
- Model: `gemini-3.1-flash-lite`
- Frontend request timeout: 30 seconds
- Backend maximum message length: 5000 characters
- Empty messages are rejected before calling the LLM
- LLM/API errors are caught and returned as a friendly fallback message
- Server-side LLM output token cap and timeout are not explicitly configured yet
- Conversation history is included in the prompt so follow-up replies can use context

## Store Knowledge

The assistant is seeded with simple fictional store policies:

- Orders ship within 2 business days.
- Returns are accepted within 30 days.
- Refunds are processed within 5 business days.
- Support hours are Monday-Friday, 9 AM - 6 PM.

## Local Setup

### Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
GEMINI_API_KEY="your-gemini-api-key"
PORT=5000
```

Generate Prisma client and apply the database schema:

```bash
npx prisma generate
npx prisma db push
```

Start the backend:

```bash
npm run dev
```

The backend runs on `http://localhost:5000` by default.

### Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
NEXT_PUBLIC_API_URL="http://localhost:5000"
```

Start the frontend:

```bash
npm run dev
```

The frontend runs on `http://localhost:3000` by default.

## Build Verification

Backend:

```bash
cd backend
npm run build
```

Frontend:

```bash
cd frontend
npm run build
```

Both production builds pass in the current project state.

## Deployment Notes

### Vercel Frontend

Set the frontend environment variable:

```env
NEXT_PUBLIC_API_URL="<RENDER_BACKEND_URL>"
```

### Render Backend

Set the backend environment variables:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
GEMINI_API_KEY="your-gemini-api-key"
PORT=5000
```

Suggested Render commands:

```bash
npm install
npm run build
npm start
```

Use a cron job or uptime monitor to ping:

```text
<RENDER_BACKEND_URL>/health
```

Current cron interval: every 14 minutes.

## Known Caveats

- No authentication is implemented because the assignment does not require it.
- CORS is permissive for take-home simplicity.
- Render free-tier cold starts may still happen despite cron pings.
- There is no automated test suite yet; production builds currently pass.
- Server-side LLM output token limits and timeout handling are not explicitly configured yet.

## Future Improvements

- Add automated backend and frontend tests.
- Add server-side LLM timeout and output token limits.
- Cap the number of previous messages included in the LLM prompt.
- Add stricter production CORS configuration.
- Add human handoff.
- Add streaming responses.
- Add multi-tenant knowledge bases.
- Package the chat UI as an embeddable widget.
