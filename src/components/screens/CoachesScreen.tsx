"use client";

import { useRef, useState } from "react";
import type { ChatMessage, CoachId, Lang, Route } from "@/lib/types";
import { L } from "@/lib/i18n";
import { Icon } from "../ui/Icon";
import { Modal, LSBadge } from "../ui/Primitives";
import { COACH_DATA } from "@/lib/coachData";
import { STUDENT } from "@/lib/seed";

export function CoachesScreen({ lang, setRoute }: { lang: Lang; setRoute: (r: Route) => void }) {
  const t = L(lang);
  const [promptOpen, setPromptOpen] = useState<CoachId | null>(null);
  const [chatCoach, setChatCoach] = useState<CoachId | null>(null);
  const userStage = STUDENT.stage;
  const stages = Object.values(COACH_DATA).sort((a, b) => a.stageId - b.stageId);

  return (
    <div style={{ padding: "24px 28px 4px" }}>
      <div
        className="row"
        style={{ alignItems: "flex-end", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}
      >
        <div style={{ maxWidth: 680 }}>
          <div className="eyebrow">{lang === "zh" ? "四階段腳手架" : "A scaffolded ladder, not a grid"}</div>
          <h2 style={{ margin: "4px 0 8px", fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em" }}>
            {t.aiCoaches}
          </h2>
          <p style={{ margin: 0, color: "var(--ink-2)", fontSize: 14, lineHeight: 1.55 }}>{t.aiCoachesSub}</p>
        </div>
        <div className="row gap-2">
          <LSBadge kind="layered" lang={lang} />
          <LSBadge kind="interleaved" lang={lang} />
        </div>
      </div>

      <div style={{ position: "relative", paddingLeft: 36 }}>
        <div style={{ position: "absolute", left: 16, top: 28, bottom: 28, width: 2, background: "var(--border)" }} />
        <div
          style={{
            position: "absolute",
            left: 16,
            top: 28,
            height: `${Math.min(100, ((userStage - 0.5) / stages.length) * 100)}%`,
            width: 2,
            background: "var(--accent)",
          }}
        />

        <div className="col gap-4">
          {stages.map((c) => {
            const unlocked = c.stageId <= userStage;
            const current = c.stageId === userStage;
            return (
              <div key={c.id} style={{ position: "relative" }}>
                <div
                  style={{
                    position: "absolute",
                    left: -28,
                    top: 28,
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: unlocked ? "var(--accent)" : "var(--surface)",
                    border: "2px solid " + (unlocked ? "var(--accent)" : "var(--border-strong)"),
                    color: "var(--accent-fg)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 700,
                    boxShadow: current ? "0 0 0 4px color-mix(in oklch, var(--accent) 25%, transparent)" : "none",
                  }}
                >
                  {unlocked ? c.stageId : <Icon name="lock" size={11} />}
                </div>

                <div
                  className="card lift coach-card"
                  style={{ padding: 22, opacity: unlocked ? 1 : 0.6 }}
                >
                  <div
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: 18,
                      background: c.bg,
                      color: `oklch(0.34 0.1 ${c.hue})`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: 24,
                      letterSpacing: "-0.02em",
                      border: `1px solid oklch(0.86 0.04 ${c.hue})`,
                    }}
                  >
                    {c.initials}
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <div className="row gap-2" style={{ alignItems: "center", marginBottom: 4, flexWrap: "wrap" }}>
                      <span className="eyebrow" style={{ color: `oklch(0.45 0.1 ${c.hue})` }}>
                        {lang === "zh" ? c.stageZh : c.stageEn}
                      </span>
                      {current && (
                        <span className="pill pill-soft">{lang === "zh" ? "目前進度" : "You are here"}</span>
                      )}
                    </div>
                    <h3 style={{ margin: "2px 0 6px", fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em" }}>
                      {c.name[lang]}
                    </h3>
                    <p
                      style={{
                        margin: "0 0 12px",
                        fontSize: 13.5,
                        color: "var(--ink-2)",
                        lineHeight: 1.55,
                      }}
                    >
                      {c.blurb[lang]}
                    </p>
                    <div className="row gap-2" style={{ flexWrap: "wrap" }}>
                      <span
                        className="pill"
                        style={{ background: c.bg, color: `oklch(0.34 0.08 ${c.hue})` }}
                      >
                        {c.skill[lang]}
                      </span>
                      {c.stageId === 4 && <LSBadge kind="metacog" lang={lang} />}
                      {c.stageId === 2 && <LSBadge kind="interleaved" lang={lang} />}
                      {c.stageId === 1 && <LSBadge kind="recall" lang={lang} />}
                      {c.stageId === 3 && <LSBadge kind="layered" lang={lang} />}
                    </div>
                  </div>

                  <div className="col gap-2" style={{ alignItems: "flex-end" }}>
                    <button
                      className="btn btn-primary"
                      disabled={!unlocked}
                      style={{ padding: "8px 14px", opacity: unlocked ? 1 : 0.5 }}
                      onClick={() => {
                        if (!unlocked) return;
                        if (c.id === "exam") {
                          setRoute("speaking");
                        } else {
                          setChatCoach(c.id);
                        }
                      }}
                    >
                      <Icon name="play" size={13} /> {unlocked ? t.talkTo : lang === "zh" ? "未解鎖" : "Locked"}
                    </button>
                    <button
                      className="btn btn-ghost"
                      style={{ padding: "6px 10px", fontSize: 12.5, color: "var(--accent-ink)" }}
                      onClick={() => setPromptOpen(c.id)}
                    >
                      <Icon name="eye" size={13} /> {t.viewPrompt}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* System prompt viewer */}
      <Modal open={!!promptOpen} onClose={() => setPromptOpen(null)} maxWidth={780}>
        {promptOpen && (
          <>
            <div className="sheet-hd row gap-3" style={{ alignItems: "flex-start" }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  flexShrink: 0,
                  background: COACH_DATA[promptOpen].bg,
                  color: `oklch(0.34 0.1 ${COACH_DATA[promptOpen].hue})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: 15,
                  border: `1px solid oklch(0.86 0.04 ${COACH_DATA[promptOpen].hue})`,
                }}
              >
                {COACH_DATA[promptOpen].initials}
              </div>
              <div className="grow">
                <div className="eyebrow" style={{ color: `oklch(0.45 0.1 ${COACH_DATA[promptOpen].hue})` }}>
                  {lang === "zh" ? COACH_DATA[promptOpen].stageZh : COACH_DATA[promptOpen].stageEn}
                </div>
                <h3 style={{ margin: "2px 0 0", fontSize: 16, fontWeight: 600 }}>
                  {COACH_DATA[promptOpen].name[lang]} · {lang === "zh" ? "系統提示" : "System prompt"}
                </h3>
                <p style={{ margin: "4px 0 0", fontSize: 12.5, color: "var(--ink-3)" }}>{t.promptHint}</p>
              </div>
              <button
                className="btn-ghost"
                style={{ width: 30, height: 30, borderRadius: 8 }}
                onClick={() => setPromptOpen(null)}
              >
                <Icon name="x" size={16} />
              </button>
            </div>
            <div className="sheet-body" style={{ paddingTop: 0 }}>
              <pre
                className="mono"
                style={{
                  margin: 0,
                  padding: 16,
                  borderRadius: 12,
                  background: "var(--surface-sunken)",
                  border: "1px solid var(--border)",
                  fontSize: 12,
                  lineHeight: 1.65,
                  whiteSpace: "pre-wrap",
                  color: "var(--ink)",
                  maxHeight: "52vh",
                  overflow: "auto",
                }}
              >
                {COACH_DATA[promptOpen].prompts[lang]}
              </pre>
              <div className="row gap-2" style={{ marginTop: 14, flexWrap: "wrap" }}>
                <span className="pill pill-soft">
                  <Icon name="shield" size={12} /> {lang === "zh" ? "每位學生由教師覆核" : "Reviewable per-student by teachers"}
                </span>
                <span className="pill" style={{ background: "var(--surface-sunken)", color: "var(--ink-2)" }}>
                  <Icon name="bolt" size={12} /> gpt-5.5
                </span>
                <span className="pill" style={{ background: "var(--surface-sunken)", color: "var(--ink-2)" }}>
                  temperature 0.4
                </span>
              </div>
            </div>
          </>
        )}
      </Modal>

      {/* Chat modal */}
      <CoachChatModal
        coachId={chatCoach}
        lang={lang}
        onClose={() => setChatCoach(null)}
      />
    </div>
  );
}

// Belt-and-suspenders: if the model still emits a stray ```json block or
// a bare top-level JSON object at the end of its reply, strip it so the
// chat bubble shows clean prose. The system prompts already forbid this.
function stripJunk(text: string): string {
  let out = text;
  // Fenced code blocks (``` … ```)
  out = out.replace(/```[\s\S]*?```/g, "").trim();
  // Trailing bare JSON object (e.g. {"useful_phrases": [...], ...})
  out = out.replace(/\s*\{[\s\S]*?"\s*:\s*[\s\S]*?\}\s*$/m, (match) => {
    // Only strip if it parses as JSON
    try { JSON.parse(match.trim()); return ""; } catch { return match; }
  }).trim();
  return out || text; // never return empty — fall back to original
}

function CoachChatModal({ coachId, lang, onClose }: { coachId: CoachId | null; lang: Lang; onClose: () => void }) {
  const t = L(lang);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const c = coachId ? COACH_DATA[coachId] : null;

  const send = async () => {
    if (!input.trim() || !coachId) return;
    const userMsg: ChatMessage = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages([...newMessages, { role: "assistant", content: "" }]);
    setInput("");
    setStreaming(true);
    setError(null);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/coaches/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coachId, lang, messages: newMessages }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({ error: "Chat request failed" }));
        throw new Error(errJson.error || "Chat request failed");
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error("No response stream");
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let nl;
        while ((nl = buffer.indexOf("\n\n")) >= 0) {
          const chunk = buffer.slice(0, nl).trim();
          buffer = buffer.slice(nl + 2);
          if (chunk.startsWith("data:")) {
            const payload = chunk.replace(/^data:\s*/, "");
            try {
              const ev = JSON.parse(payload);
              if (ev.delta) {
                setMessages((prev) => {
                  const copy = [...prev];
                  const last = copy[copy.length - 1];
                  if (last && last.role === "assistant") {
                    copy[copy.length - 1] = { ...last, content: last.content + ev.delta };
                  }
                  return copy;
                });
              }
              if (ev.error) setError(ev.error);
            } catch {
              // ignore parse errors
            }
          }
        }
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setError(err instanceof Error ? err.message : String(err));
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  };

  if (!coachId || !c) return null;

  return (
    <Modal open={!!coachId} onClose={onClose} maxWidth={680}>
      <div className="sheet-hd row gap-3" style={{ alignItems: "center" }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: c.bg,
            color: `oklch(0.34 0.1 ${c.hue})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: 14,
            border: `1px solid oklch(0.86 0.04 ${c.hue})`,
            flexShrink: 0,
          }}
        >
          {c.initials}
        </div>
        <div className="grow">
          <div className="eyebrow">{lang === "zh" ? c.stageZh : c.stageEn}</div>
          <h3 style={{ margin: "2px 0 0", fontSize: 15, fontWeight: 600 }}>{c.name[lang]}</h3>
        </div>
        <button className="btn-ghost" style={{ width: 30, height: 30, borderRadius: 8 }} onClick={onClose}>
          <Icon name="x" size={16} />
        </button>
      </div>
      <div className="sheet-body" style={{ display: "flex", flexDirection: "column", gap: 12, padding: 18, minHeight: 360 }}>
        <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column", gap: 12, minHeight: 200 }}>
          {messages.length === 0 && (
            <div
              style={{
                textAlign: "center",
                color: "var(--ink-3)",
                fontSize: 13,
                padding: 20,
                lineHeight: 1.6,
              }}
            >
              <Icon name="chat" size={24} />
              <p style={{ margin: "10px 0 0" }}>
                {lang === "zh"
                  ? `向 ${c.name.zh} 發送訊息開始練習。`
                  : `Send a message to ${c.name.en} to begin.`}
              </p>
            </div>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              className="row gap-2"
              style={{
                flexDirection: m.role === "user" ? "row-reverse" : "row",
                alignItems: "flex-end",
              }}
            >
              <div className={`bubble ${m.role === "user" ? "bubble-user" : "bubble-bot"}`}>
                {m.content
                  ? m.role === "assistant"
                    ? stripJunk(m.content)
                    : m.content
                  : streaming && i === messages.length - 1
                  ? <em style={{ opacity: 0.5 }}>{t.coachThinking}</em>
                  : ""}
              </div>
            </div>
          ))}
          {error && (
            <div style={{ padding: 10, fontSize: 12, color: "var(--bad)" }}>
              <Icon name="warn" size={12} /> {error}
            </div>
          )}
        </div>
        <div className="row gap-2" style={{ alignItems: "center" }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder={t.askCoach}
            disabled={streaming}
            style={{
              flex: 1,
              padding: "10px 14px",
              border: "1px solid var(--border-strong)",
              borderRadius: 8,
              fontSize: 14,
              background: "var(--surface)",
              color: "var(--ink)",
            }}
          />
          <button className="btn btn-primary" onClick={send} disabled={streaming || !input.trim()}>
            <Icon name="send" size={14} /> {streaming ? (lang === "zh" ? "傳送中" : "Sending") : t.submit}
          </button>
        </div>
      </div>
    </Modal>
  );
}
