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

export const MODELS = {
  realtime: process.env.OPENAI_REALTIME_MODEL || "gpt-realtime-2",
  text: process.env.OPENAI_TEXT_MODEL || "gpt-5.5",
} as const;
