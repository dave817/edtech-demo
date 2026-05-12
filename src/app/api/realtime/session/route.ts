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

  try {
    const resp = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODELS.realtime,
        voice,
        modalities: ["audio", "text"],
        instructions,
        input_audio_transcription: { model: "whisper-1" },
        turn_detection: {
          type: "server_vad",
          threshold: 0.5,
          prefix_padding_ms: 300,
          silence_duration_ms: 700,
        },
      }),
    });

    const data = await resp.json();
    if (!resp.ok) {
      return NextResponse.json({ error: data.error?.message || "Failed to create realtime session", details: data }, { status: resp.status });
    }
    return NextResponse.json({
      client_secret: data.client_secret,
      model: data.model || MODELS.realtime,
      voice,
      instructions,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `Realtime session error: ${msg}` }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: "ok", model: MODELS.realtime });
}
