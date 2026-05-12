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

// Model defaults — lightweight for a demo. Override via env vars in Vercel:
//   OPENAI_REALTIME_MODEL — Realtime model (gpt-realtime is the broadly available GA baseline,
//                           gpt-realtime-2 is the latest with reasoning but pricier)
//   OPENAI_TEXT_MODEL     — primary text model (gpt-4o-mini = cheap+fast+native json_schema)
//   OPENAI_TEXT_FALLBACK  — used if primary rejects response_format json_schema
export const MODELS = {
  realtime: process.env.OPENAI_REALTIME_MODEL || "gpt-realtime",
  text: process.env.OPENAI_TEXT_MODEL || "gpt-4o-mini",
  textFallback: process.env.OPENAI_TEXT_FALLBACK || "gpt-4o-2024-08-06",
} as const;
