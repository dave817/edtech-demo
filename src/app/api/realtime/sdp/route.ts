import type { SpeakingMode } from "@/lib/types";
import { getSpeakingPrompt, accentToVoice } from "@/lib/prompts";
import { MODELS } from "@/lib/openai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface SdpRequest {
  sdp: string;
  mode: SpeakingMode;
  accent?: "UK" | "US" | "AU" | "CA";
  bandTarget?: number;
  strictness?: "Low" | "Medium" | "High";
}

// GA Realtime WebRTC flow per OpenAI docs:
//   POST https://api.openai.com/v1/realtime/calls
//   multipart/form-data:
//     sdp: <offer SDP>
//     session: <JSON session config>
//   Authorization: Bearer <standard API key>
// Response: SDP answer as text body.
//
// We proxy through this route so the API key never leaves the server. The browser
// posts its SDP offer to /api/realtime/sdp and receives the SDP answer.
export async function POST(req: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "OPENAI_API_KEY is not configured on the server." }, { status: 500 });
  }

  let body: SdpRequest;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!body.sdp) {
    return Response.json({ error: "Missing 'sdp' field" }, { status: 400 });
  }

  const mode = body.mode || "p1";
  const accent = body.accent || "UK";
  const bandTarget = body.bandTarget ?? 7.0;
  const strictness = body.strictness || "Medium";

  const instructions = getSpeakingPrompt(mode, bandTarget, strictness, accent);
  const voice = accentToVoice(accent);

  const sessionConfig = {
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
  };

  const form = new FormData();
  form.append("sdp", body.sdp);
  form.append("session", JSON.stringify(sessionConfig));

  try {
    const resp = await fetch("https://api.openai.com/v1/realtime/calls", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        // Content-Type is set automatically by FormData with the multipart boundary
      },
      body: form,
    });

    const text = await resp.text();
    if (!resp.ok) {
      // Surface OpenAI's error verbatim. Common: model access, schema, or auth.
      let detail: unknown = text;
      try { detail = JSON.parse(text); } catch { /* leave as text */ }
      return Response.json({ error: "Realtime SDP exchange failed", model: MODELS.realtime, detail }, { status: resp.status });
    }

    // GA returns the SDP answer as plain text. The Location header carries the call_id
    // for server-side reconnection via WebSocket if needed (not used here).
    return new Response(text, {
      status: 200,
      headers: {
        "Content-Type": "application/sdp",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return Response.json({ error: `Realtime SDP exchange error: ${msg}` }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({ status: "ok", model: MODELS.realtime, endpoint: "/v1/realtime/calls (multipart)" });
}
