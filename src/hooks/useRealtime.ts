"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SpeakingMode, TranscriptMessage } from "@/lib/types";

export type RealtimeStatus = "idle" | "connecting" | "ready" | "active" | "ended" | "error";

const SESSION_LIMIT_MS = 5 * 60 * 1000; // 5 minutes

interface UseRealtimeOptions {
  mode: SpeakingMode;
  accent: "UK" | "US" | "AU" | "CA";
  bandTarget: number;
  strictness: "Low" | "Medium" | "High";
}

export function useRealtime(options: UseRealtimeOptions) {
  const [status, setStatus] = useState<RealtimeStatus>("idle");
  const [messages, setMessages] = useState<TranscriptMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(SESSION_LIMIT_MS / 1000);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const startedAtRef = useRef<number | null>(null);

  const appendOrUpdateMessage = useCallback((msg: TranscriptMessage, mergeWithLast = false) => {
    setMessages((prev) => {
      if (mergeWithLast && prev.length > 0 && prev[prev.length - 1].who === msg.who) {
        const copy = [...prev];
        copy[copy.length - 1] = { ...copy[copy.length - 1], text: copy[copy.length - 1].text + msg.text };
        return copy;
      }
      return [...prev, msg];
    });
  }, []);

  const stop = useCallback(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    try {
      dcRef.current?.close();
    } catch {}
    try {
      pcRef.current?.getSenders().forEach((s) => s.track?.stop());
      pcRef.current?.close();
    } catch {}
    try {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    } catch {}
    if (audioElRef.current) {
      audioElRef.current.srcObject = null;
    }
    pcRef.current = null;
    dcRef.current = null;
    streamRef.current = null;
    startedAtRef.current = null;
    setStatus("ended");
  }, []);

  const start = useCallback(async () => {
    if (status === "connecting" || status === "active" || status === "ready") return;
    setError(null);
    setMessages([]);
    setStatus("connecting");
    setSecondsLeft(SESSION_LIMIT_MS / 1000);

    try {
      // GA Realtime browser WebRTC flow:
      //   1. Server mints ephemeral via POST /v1/realtime/client_secrets (session config inside)
      //   2. Browser POSTs SDP offer directly to https://api.openai.com/v1/realtime
      //      (NO /calls suffix, NO ?model= query — that combo triggers beta routing
      //      which rejects GA ephemeral tokens with "API version mismatch")
      //   3. Use ephemeral as Bearer, Content-Type application/sdp
      //   4. Response body is the SDP answer (text)
      // The API key stays server-side; only the short-lived ephemeral is exposed.

      const sessionRes = await fetch("/api/realtime/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: options.mode,
          accent: options.accent,
          bandTarget: options.bandTarget,
          strictness: options.strictness,
        }),
      });
      const sessionJson = await sessionRes.json();
      if (!sessionRes.ok) {
        const detailMsg = sessionJson?.detail?.error?.message;
        throw new Error(detailMsg || sessionJson.error || "Failed to start session");
      }
      const token: string | undefined = sessionJson?.client_secret;
      if (!token) throw new Error("No ephemeral token returned from server");

      // 2. WebRTC peer
      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      // 3. Audio element for remote audio. Attach to DOM — Safari iOS mutes detached elements.
      if (typeof document !== "undefined") {
        let audio = audioElRef.current;
        if (!audio) {
          audio = document.createElement("audio");
          audio.autoplay = true;
          audio.style.display = "none";
          audio.setAttribute("playsinline", "");
          document.body.appendChild(audio);
          audioElRef.current = audio;
        }
        pc.ontrack = (e) => {
          if (audioElRef.current) {
            audioElRef.current.srcObject = e.streams[0];
          }
        };
      }

      // 4. Mic. Use permissive constraints — strict sampleRate/channelCount can
      // produce NotFoundError ("Requested device not found") on systems whose
      // default device doesn't advertise the requested rate. WebRTC handles
      // resampling internally.
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
      streamRef.current = stream;
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      // 5. Data channel
      const dc = pc.createDataChannel("oai-events");
      dcRef.current = dc;
      dc.onopen = () => {
        setStatus("ready");
        startedAtRef.current = Date.now();
        timerRef.current = window.setInterval(() => {
          const elapsed = Date.now() - (startedAtRef.current ?? Date.now());
          const remaining = Math.max(0, Math.floor((SESSION_LIMIT_MS - elapsed) / 1000));
          setSecondsLeft(remaining);
          if (remaining === 0) stop();
        }, 1000);
      };
      dc.onmessage = (e) => {
        try {
          const ev = JSON.parse(e.data);
          handleRealtimeEvent(ev);
        } catch {
          // ignore non-JSON
        }
      };

      function handleRealtimeEvent(ev: { type: string;[key: string]: unknown }) {
        const time = formatTimeFromStart(startedAtRef.current);
        switch (ev.type) {
          case "session.created":
          case "session.updated":
            setStatus("active");
            break;
          case "input_audio_buffer.speech_started":
            // student began speaking
            break;
          case "input_audio_buffer.speech_stopped":
            break;
          case "conversation.item.input_audio_transcription.completed": {
            const transcript = ev.transcript as string | undefined;
            if (transcript) {
              appendOrUpdateMessage({ who: "student", text: transcript, time });
            }
            break;
          }
          case "response.audio_transcript.delta": {
            const delta = ev.delta as string | undefined;
            if (delta) {
              setMessages((prev) => {
                if (prev.length === 0 || prev[prev.length - 1].who !== "examiner") {
                  return [...prev, { who: "examiner", text: delta, time }];
                }
                const copy = [...prev];
                copy[copy.length - 1] = { ...copy[copy.length - 1], text: copy[copy.length - 1].text + delta };
                return copy;
              });
            }
            break;
          }
          case "response.audio_transcript.done": {
            // examiner finished a turn
            break;
          }
          case "error": {
            const errObj = ev.error as { message?: string } | undefined;
            setError(errObj?.message || "Realtime error");
            break;
          }
        }
      }

      // 6. SDP offer → POST to GA Realtime endpoint with ephemeral token
      // Endpoint matrix (confirmed by user testing):
      //   /v1/realtime?model=X    BETA  rejects GA client_secret (version mismatch)
      //   /v1/realtime            BETA  same — bare endpoint also triggers beta routing
      //   /v1/realtime/calls      GA    correct for browser WebRTC with ephemeral + SDP
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const sdpResponse = await fetch("https://api.openai.com/v1/realtime/calls", {
        method: "POST",
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/sdp",
        },
      });
      if (!sdpResponse.ok) {
        const errText = await sdpResponse.text();
        throw new Error(`Realtime SDP exchange failed: ${errText}`);
      }
      const answerSdp = await sdpResponse.text();
      await pc.setRemoteDescription({ type: "answer", sdp: answerSdp });
    } catch (err) {
      // Map common browser errors to actionable messages so users know which side to fix.
      let msg = err instanceof Error ? err.message : String(err);
      const name = err instanceof Error ? err.name : "";
      if (name === "NotFoundError" || /Requested device not found/i.test(msg)) {
        msg = "No microphone detected. Plug one in (or grant browser access) and try again. (Browser-side issue, not the server.)";
      } else if (name === "NotAllowedError" || /Permission denied/i.test(msg)) {
        msg = "Microphone permission denied. Click the mic/lock icon in the address bar to allow access.";
      } else if (name === "NotReadableError") {
        msg = "Microphone is in use by another app. Close other apps using the mic and try again.";
      }
      setError(msg);
      setStatus("error");
      stop();
    }
  }, [status, options.mode, options.accent, options.bandTarget, options.strictness, appendOrUpdateMessage, stop]);

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return { status, messages, error, secondsLeft, start, stop };
}

function formatTimeFromStart(start: number | null): string {
  if (!start) return "0:00";
  const sec = Math.floor((Date.now() - start) / 1000);
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
