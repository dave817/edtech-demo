import { NextResponse } from "next/server";
import type { SpeakingMode } from "@/lib/types";
import { getSpeakingPrompt, accentToVoice } from "@/lib/prompts";
import { MODELS } from "@/lib/openai";

export const runtime = "nodejs";

interface SessionRequest {
  mode: SpeakingMode;
  accent?: "UK" | "US" | "AU" | "CA";
  bandTarget?: number;
  strictness?: "Low" | "Medium" | "High";
}

export async function POST(req: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "OPENAI_API_KEY is not configured on the server." }, { status: 500 });
  }

  let body: SessionRequest;
  try {
    body = await req.json();
  } catch {
    body = { mode: "p1" };
  }

  const mode = body.mode || "p1";
  const accent = body.accent || "UK";
  const bandTarget = body.bandTarget ?? 7.0;
  const strictness = body.strictness || "Medium";

  const instructions = getSpeakingPrompt(mode, bandTarget, strictness, accent);
  const voice = accentToVoice(accent);

  // GA Realtime API: POST /v1/realtime/client_secrets
  // The legacy /v1/realtime/sessions endpoint only accepts beta models like gpt-4o-realtime-preview.
  // gpt-realtime / gpt-realtime-2 (GA) require this newer endpoint with the session-nested shape.
  const sessionBody = {
    expires_after: { anchor: "created_at", seconds: 600 },
    session: {
      type: "realtime",
      model: MODELS.realtime,
      instructions,
      audio: {
        input: {
          transcription: { model: "whisper-1" },
          turn_detection: {
            type: "server_vad",
            threshold: 0.5,
            prefix_padding_ms: 300,
            silence_duration_ms: 700,
          },
        },
        output: { voice },
      },
    },
  };

  try {
    const resp = await fetch("https://api.openai.com/v1/realtime/client_secrets", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sessionBody),
    });

    const data = await resp.json();
    if (!resp.ok) {
      const msg = data?.error?.message || "Failed to create realtime session";
      return NextResponse.json({ error: msg, details: data }, { status: resp.status });
    }
    // GA response shape: { value: "ek_...", expires_at: number, session: {...} }
    return NextResponse.json({
      client_secret: data.value,
      expires_at: data.expires_at,
      model: data.session?.model || MODELS.realtime,
      voice,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `Realtime session error: ${msg}` }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: "ok", model: MODELS.realtime });
}
