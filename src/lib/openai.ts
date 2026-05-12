import OpenAI from "openai";

let _client: OpenAI | null = null;

export function getOpenAI(): OpenAI {
  if (!_client) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY environment variable is not set");
    }
    _client = new OpenAI({ apiKey });
  }
  return _client;
}

// Model defaults. Override via env vars in Vercel:
//   OPENAI_REALTIME_MODEL — must be a GA Realtime model (gpt-realtime or gpt-realtime-2)
//   OPENAI_TEXT_MODEL     — primary text model; can be any chat-capable model
//   OPENAI_TEXT_FALLBACK  — used if primary rejects response_format json_schema (e.g. older models)
export const MODELS = {
  realtime: process.env.OPENAI_REALTIME_MODEL || "gpt-realtime-2",
  text: process.env.OPENAI_TEXT_MODEL || "gpt-5.5",
  textFallback: process.env.OPENAI_TEXT_FALLBACK || "gpt-4o-2024-08-06",
} as const;
