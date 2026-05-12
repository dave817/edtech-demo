# Lumen · IELTS Studio

> An integrated AI-assisted English practice studio for Hong Kong secondary school students. Built as a working demo to show how to combine a polished UI, real OpenAI capabilities, bilingual EN/繁中 support, Cantonese-L1 awareness, and a teacher dashboard into one product.

**Status:** Demo build. Three live AI flows (Speaking · Writing · Coaches) + seven polished mock screens forming a complete learning experience.

---

## Live demo

🌐 Deploy URL: _(fill in after Vercel deploy)_

Try the three live flows:

1. **Speaking** → click the mic, talk to an IELTS examiner via OpenAI Realtime API (`gpt-realtime-2`).
2. **Writing** → switch the right tab to "Write your own", paste an essay, and click "Submit for AI feedback" (`gpt-5.5` with strict JSON schema).
3. **AI Coaches** → click "Start session" on Stage 1, 2, or 4 to stream a chat with the coach (Stage 3 routes to Speaking since that's where examiner roleplay lives).

---

## What's live vs mocked

| Screen | Status | What it does |
|---|---|---|
| **Speaking** | 🟢 Live | OpenAI Realtime WebRTC. 6 modes (Free / P1 / P2 / 4-3-2 / P3 / Full exam), accent selector (UK/US/AU/CA), strictness, band target. 5-min session cap. |
| **Writing** | 🟢 Live | gpt-5.5 with JSON-schema feedback. 3 drill types live (Task 2 / Opening / Body); 5 more as "Coming soon". Pre-loaded sample essay graded with 7 inline annotations on first load. |
| **AI Coaches** | 🟢 Live | gpt-5.5 streaming chat. 4 coach personas with full system prompts visible (EN + 繁中). |
| Today | Polished mock | Daily mission, skill radar, regularity heatmap, recent-feedback log (deep-links into Speaking/Writing). |
| Practice | Polished mock | 8 drill cards; 3 link into live screens, 5 marked "Coming soon". |
| Pronunciation Lab | Polished mock | 4 phonemes absent from Cantonese phonology (/θ/, /ð/, /v/, /r/). |
| Library | Polished mock | 12 cross-skill items (3 saved from past writing). |
| Night Review | Polished mock | 10-min pre-sleep spaced-repetition deck. |
| Progress | Polished mock | 30-day heatmap, band trajectory, milestones. |
| Teacher | Polished mock | Class of 8 students, gap heatmap, "Auto-assign drill" button. |

---

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│  Browser (Next.js client)                                    │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────┐  │
│  │ Speaking UI │  │ Writing UI   │  │ Coaches chat UI    │  │
│  │ + WebRTC    │  │ + textarea   │  │ + SSE stream       │  │
│  └──────┬──────┘  └──────┬───────┘  └────────┬───────────┘  │
└─────────┼────────────────┼───────────────────┼──────────────┘
          │                │                   │
          ▼                ▼                   ▼
┌──────────────────────────────────────────────────────────────┐
│  Next.js API routes (server, holds OPENAI_API_KEY)           │
│  /api/realtime/session   /api/writing/feedback   /api/coaches/chat
└─────────┬────────────────┬───────────────────┬──────────────┘
          │                │                   │
          ▼                ▼                   ▼
┌──────────────────────────────────────────────────────────────┐
│  OpenAI                                                       │
│  gpt-realtime-2       gpt-5.5 (JSON)       gpt-5.5 (stream)  │
└──────────────────────────────────────────────────────────────┘
```

Key design choices:

- **Standard OpenAI** SDK (not Azure). Single `OPENAI_API_KEY` env var, never exposed to the client.
- **Realtime via WebRTC + ephemeral tokens**: server mints a short-lived session token; browser does SDP exchange directly with OpenAI. Mic stays in the browser.
- **Strict JSON schema** for writing feedback — annotations are emitted as character offsets so the renderer can layer them precisely on the original essay.
- **Bilingual prompts** — every coach has EN + 繁中 system prompts; the language toggle in the topbar swaps both UI strings and the prompt used.
- **Cantonese-L1 phonology hooks** — Speaking system prompt instructs the model to silently note /θ/→/f/, /v/→/w/, syllable-final /l/ deletion, etc.; UI surfaces these as tooltips.

---

## Run locally

```bash
# 1. Install dependencies
npm install

# 2. Set your OpenAI API key
cp .env.example .env.local
# Edit .env.local and set OPENAI_API_KEY=sk-proj-...

# 3. Run the dev server
npm run dev

# Open http://localhost:3000
```

---

## Deploy to Vercel

1. Push this branch to `main` (or import the repo into Vercel directly).
2. In the Vercel dashboard, add the env var:
   - `OPENAI_API_KEY` = `sk-proj-...`
3. (Optional) Override model defaults:
   - `OPENAI_REALTIME_MODEL` = `gpt-realtime-2`
   - `OPENAI_TEXT_MODEL` = `gpt-5.5`

The app is a single Next.js project — no extra build steps.

---

## Pedagogical principles

The product encodes several principles from the author's own language-learning experience:

- **Regularity beats motivation** — the top-bar metric is "Regularity" (% of past days practised), not "streak". A 23-day longest run is celebrated, but the headline number is the rolling 14-day percentage.
- **Cantonese-L1 awareness** — system prompts explicitly flag substitutions that Cantonese speakers make (/θ/→/f/, /v/→/w/, plural-s drop, final-consonant cluster reduction).
- **Hard scoring, not flattery** — the writing prompt encodes "极低可抬杠性" (minimum rebuttable) thresholds: Band 9 = irrefutable, Band 8 = very strong logic. The model is instructed to underscore weaknesses rather than puff scores.
- **Layered progression** — the Coaches screen is a four-stage ladder, not a grid of equals. Stage 1 = low-pressure chat (no scoring, no "wrong"); Stage 4 = argument deconstruction.
- **Learning-science badges** — every feature is tagged with the Carey (2014) principle it implements (active recall, spaced repetition, interleaved practice, layered practice, consolidation, metacognitive calibration).

---

## What I'd build next (with more time)

- **TTS playback** of corrected sentences (the principle file mentions saving these for ambient listening — `gpt-4o-mini-tts` is the natural fit).
- **Persistence** — replace in-memory state with Prisma + Postgres so practice history survives across sessions.
- **LMS auth** — Google/Microsoft SSO for school deployment; per-student dashboards for teachers.
- **Teacher prompt editor** — let teachers tune the system prompts per cohort (the UI already hints at this with "View system prompt").
- **Pronunciation Lab phoneme drilling** — TTS model output + Whisper analysis of student playback for shadowing practice.
- **Full 8 writing drills** — currently 3 are live (task2/opening/body); the other 5 (counter, point-generation, task1, template-fill, full-practice) appear as "Coming soon" chips.
- **Cantonese (粵語) UI option** in addition to 繁體中文 (traditional Chinese characters).
- **HKDSE Paper 4 mode** — the exam-style framing is already there; adapting the rubric to HKDSE bands is a one-day change.

---

## Tech stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript**
- **OpenAI SDK** (`openai` npm package) — standard, not Azure
- Pure CSS with oklch design tokens; no Tailwind (the design ships its own complete token system)
- `next/font/google` for Newsreader, Public Sans, IBM Plex Mono
- localStorage for client preferences (theme, accent, language)
- No database (single-user demo); ready to add Prisma later

## License

Demo project. No license declared — feel free to fork.
