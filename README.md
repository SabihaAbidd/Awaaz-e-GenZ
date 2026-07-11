# Awaaz-e-GenZ

Awaaz-e-GenZ is a React + Vite civic action prototype built for young Pakistanis. The product is designed around one practical idea: people do not want to read long civic guides when something goes wrong; they want to explain the problem and know what to do next.

The app helps users move from confusion to action through bilingual civic guidance, short explainers, quiz practice, daily civic facts, and a Civic SOS flow that turns a real-life issue into a safe action plan.

## Core Demo Flow

1. Open Civic SOS.
2. Type a civic problem in English or Pakistani Roman Urdu.
3. Generate an action plan.
4. Review the summary, likely responsible authority type, next steps, safety note, and ready-to-send complaint message.
5. Copy the message for email, WhatsApp, or a complaint form.

## Features

- Civic SOS action plans with AI endpoint support and a demo-safe fallback.
- Ask Awaaz civic helper that calls an AI endpoint when configured and falls back safely for demos.
- Bite-size explainers for rights, elections, government, law, and budget basics.
- Civic Cards with source-aware civic facts.
- A working five-question civic quiz with scoring and feedback.
- Mobile-first navigation and bilingual product positioning.

## AI Endpoint Configuration

Ask Awaaz calls the local backend endpoint:

- `/api/ask-awaaz`

The backend reads provider keys from `.env.local` or the deployment environment. Use `AI_PROVIDER_ORDER=grok,gemini` to try Grok first and automatically fall back to Gemini if Grok fails. Single-provider mode still works with `AI_PROVIDER=openai`, `AI_PROVIDER=grok`, or `AI_PROVIDER=gemini`. Do not use a `VITE_` prefix for AI provider keys, because Vite exposes `VITE_` variables to client-side JavaScript.

If the endpoint fails, Ask Awaaz still has a small last-resort fallback so the hackathon demo does not break.

## Run Locally

```bash
npm install
npm run dev
```

To use real OpenAI, Grok, or Gemini responses locally, create `.env.local` from `.env.example` and add your API key:

```bash
cp .env.example .env.local
npm run api
```

Then run the frontend in another terminal:

```bash
npm run dev
```

Build and lint:

```bash
npm run build
npm run lint
```

## Demo Routes

This app uses `HashRouter`, so local routes look like:

- `/#/`
- `/#/sos`
- `/#/ask`
- `/#/learn`
- `/#/cards`
- `/#/quiz`
- `/#/about`

## Safety Positioning

Awaaz-e-GenZ provides civic education and practical drafting support. It should stay politically neutral, avoid endorsing parties or candidates, and avoid inventing official phone numbers, emails, laws, or URLs.
