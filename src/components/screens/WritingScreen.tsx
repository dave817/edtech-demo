"use client";

import { useRef, useState, type ReactNode } from "react";
import type { Lang, Annotation, ChatMessage, WritingFeedback, WritingDrillType } from "@/lib/types";
import { L } from "@/lib/i18n";
import { Icon } from "../ui/Icon";
import { Bar } from "../ui/Primitives";
import { COACH_DATA } from "@/lib/coachData";
import { SAMPLE_ESSAY, SAMPLE_FEEDBACK } from "@/lib/seed";

const TYPE_COLOR: Record<Annotation["type"], string> = {
  grammar: "var(--bad)",
  lexical: "var(--xp)",
  cohesion: "var(--accent)",
  task: "var(--warn)",
};

function renderEssayWithAnnotations(
  text: string,
  annotations: Annotation[],
  activeId: number | null,
  setActiveId: (id: number) => void,
): ReactNode[] {
  // Sort by start, drop overlaps
  const sorted = [...annotations].sort((a, b) => a.start - b.start);
  const valid: Annotation[] = [];
  let lastEnd = -1;
  for (const a of sorted) {
    if (a.start >= lastEnd) {
      valid.push(a);
      lastEnd = a.end;
    }
  }

  const nodes: ReactNode[] = [];
  let cursor = 0;
  valid.forEach((a, i) => {
    if (cursor < a.start) {
      nodes.push(<span key={`t${i}`}>{text.slice(cursor, a.start)}</span>);
    }
    const isActive = activeId === i;
    nodes.push(
      <span
        key={`a${i}`}
        className={`anno anno-${a.type}${isActive ? " is-active" : ""}`}
        onMouseEnter={() => setActiveId(i)}
        onClick={() => setActiveId(i)}
      >
        {text.slice(a.start, a.end)}
      </span>,
    );
    cursor = a.end;
  });
  if (cursor < text.length) nodes.push(<span key="tend">{text.slice(cursor)}</span>);
  return nodes;
}

const DRILL_OPTIONS: Array<{ id: WritingDrillType; label_en: string; label_zh: string }> = [
  { id: "task2", label_en: "Task 2 essay", label_zh: "Task 2 議論文" },
  { id: "opening", label_en: "Opening paragraph", label_zh: "開頭段" },
  { id: "body", label_en: "Body paragraph", label_zh: "本論段" },
];

export function WritingScreen({ lang }: { lang: Lang }) {
  const t = L(lang);
  const [tab, setTab] = useState<"sample" | "live">("sample");
  const [drillType, setDrillType] = useState<WritingDrillType>("task2");
  const [essay, setEssay] = useState("");
  const [feedback, setFeedback] = useState<WritingFeedback | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<number>(0);
  const [chatOpen, setChatOpen] = useState(false);

  const onSubmit = async () => {
    setError(null);
    setLoading(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/writing/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          drillType,
          prompt: "",
          userResponse: essay,
          lang,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Feedback request failed");
      setFeedback(data as WritingFeedback);
      setActiveId(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const displayedEssay = tab === "sample" ? SAMPLE_ESSAY.body : essay;
  const displayedFeedback = tab === "sample" ? SAMPLE_FEEDBACK : feedback;
  const displayedQuestion = tab === "sample" ? SAMPLE_ESSAY.question : "";

  return (
    <div className="split-essay" style={{ padding: "20px 28px 4px" }}>
      {/* Left: Essay */}
      <div className="card" style={{ padding: 0, display: "flex", flexDirection: "column" }}>
        <div className="row gap-2" style={{ padding: "14px 22px", borderBottom: "1px solid var(--border)", alignItems: "center" }}>
          <span className="pill pill-soft">{drillType.toUpperCase()}</span>
          <span style={{ fontSize: 12.5, color: "var(--ink-3)" }}>
            {tab === "sample"
              ? lang === "zh"
                ? "範例 · 已 AI 評改"
                : "Sample · AI graded"
              : lang === "zh"
              ? "自行撰寫"
              : "Your own"}
          </span>
          <span style={{ flex: 1 }} />
          <div style={{ display: "inline-flex", border: "1px solid var(--border-strong)" }}>
            {(["sample", "live"] as const).map((tb) => (
              <button
                key={tb}
                onClick={() => setTab(tb)}
                style={{
                  padding: "4px 12px",
                  fontSize: 11.5,
                  fontWeight: 600,
                  background: tab === tb ? "var(--ink)" : "transparent",
                  color: tab === tb ? "var(--bg)" : "var(--ink-3)",
                }}
              >
                {tb === "sample" ? t.sampleMode : t.liveMode}
              </button>
            ))}
          </div>
        </div>

        {tab === "sample" ? (
          <div style={{ padding: "22px 28px", overflow: "auto", flex: 1 }}>
            <h3
              className="serif"
              style={{
                margin: "0 0 14px",
                fontSize: 16,
                fontWeight: 600,
                color: "var(--ink-2)",
                lineHeight: 1.5,
              }}
            >
              {displayedQuestion}
            </h3>
            <div className="serif" style={{ fontSize: 16, lineHeight: 1.85, color: "var(--ink)", whiteSpace: "pre-wrap" }}>
              {displayedFeedback && renderEssayWithAnnotations(displayedEssay, displayedFeedback.annotations, activeId, setActiveId)}
            </div>
          </div>
        ) : (
          <div style={{ padding: "16px 22px", display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
            <div className="row gap-2" style={{ justifyContent: "space-between", flexWrap: "wrap" }}>
              <div className="row gap-2">
                {DRILL_OPTIONS.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setDrillType(d.id)}
                    className="pill"
                    style={{
                      cursor: "pointer",
                      background: drillType === d.id ? "var(--accent)" : "var(--surface-sunken)",
                      color: drillType === d.id ? "var(--accent-fg)" : "var(--ink-2)",
                    }}
                  >
                    {lang === "zh" ? d.label_zh : d.label_en}
                  </button>
                ))}
              </div>
              <div className="row gap-2">
                <button
                  className="btn btn-ghost"
                  onClick={async () => {
                    try {
                      const text = await navigator.clipboard.readText();
                      if (text) setEssay(text);
                    } catch {
                      /* clipboard read blocked (no permission, no https, or unsupported) */
                    }
                  }}
                  style={{ fontSize: 12, padding: "6px 10px" }}
                  title={lang === "zh" ? "從剪貼簿貼上" : "Paste from clipboard"}
                >
                  <Icon name="download" size={12} />
                  {lang === "zh" ? "貼上" : "Paste"}
                </button>
                {essay.length > 0 && (
                  <button
                    className="btn btn-ghost"
                    onClick={() => {
                      if (
                        window.confirm(
                          lang === "zh"
                            ? "確定要清除目前的草稿嗎？此動作無法復原。"
                            : "Clear the current draft? This can't be undone.",
                        )
                      ) {
                        setEssay("");
                      }
                    }}
                    style={{ fontSize: 12, padding: "6px 10px" }}
                  >
                    <Icon name="x" size={12} />
                    {lang === "zh" ? "清除" : "Clear"}
                  </button>
                )}
              </div>
            </div>
            <textarea
              value={essay}
              onChange={(e) => setEssay(e.target.value)}
              placeholder={t.typeHere}
              className="serif"
              style={{
                flex: 1,
                minHeight: 280,
                padding: 16,
                fontSize: 15,
                lineHeight: 1.7,
                border: "1px solid var(--border)",
                borderRadius: 4,
                resize: "vertical",
                background: "var(--surface)",
                color: "var(--ink)",
              }}
            />
            <div className="row gap-2" style={{ justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: "var(--ink-3)" }}>
                {essay.length} {lang === "zh" ? "字元" : "chars"} · {essay.split(/\s+/).filter(Boolean).length}{" "}
                {lang === "zh" ? "詞" : "words"}
              </span>
              <button
                className="btn btn-primary"
                onClick={onSubmit}
                disabled={loading || essay.trim().length < 30}
              >
                {loading ? (
                  <>
                    <Icon name="refresh" size={13} /> {lang === "zh" ? "AI 評改中…" : "AI grading…"}
                  </>
                ) : (
                  <>
                    <Icon name="sparkles" size={14} /> {t.submitEssay}
                  </>
                )}
              </button>
            </div>
            {error && (
              <div
                style={{
                  padding: 12,
                  background: "color-mix(in oklch, var(--bad) 8%, var(--surface))",
                  border: "1px solid color-mix(in oklch, var(--bad) 30%, var(--border))",
                  borderRadius: 4,
                  fontSize: 13,
                  color: "var(--ink-2)",
                }}
              >
                <b>{lang === "zh" ? "錯誤" : "Error"}:</b> {error}
              </div>
            )}
            {feedback && (
              <div style={{ padding: "16px 0", borderTop: "1px solid var(--border)", overflow: "auto" }}>
                <div className="eyebrow" style={{ marginBottom: 10 }}>
                  {lang === "zh" ? "AI 評改" : "AI Feedback"}
                </div>
                <div className="serif" style={{ fontSize: 16, lineHeight: 1.85, color: "var(--ink)", whiteSpace: "pre-wrap" }}>
                  {renderEssayWithAnnotations(essay, feedback.annotations, activeId, setActiveId)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bottom bar */}
        {displayedFeedback && (
          <div className="row gap-3" style={{ padding: "14px 22px", borderTop: "1px solid var(--border)", background: "var(--bg-2)" }}>
            <div>
              <div style={{ fontSize: 11, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: ".06em" }}>
                {t.bandEstimate}
              </div>
              <div className="row gap-2" style={{ alignItems: "baseline", marginTop: 2 }}>
                <span style={{ fontSize: 22, fontWeight: 700, color: "var(--accent-ink)" }}>
                  {displayedFeedback.overallBand.toFixed(1)}
                </span>
              </div>
            </div>
            <div style={{ width: 1, height: 30, background: "var(--border)" }} />
            <div className="grow">
              <div style={{ fontSize: 11, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: ".06em" }}>
                {t.topAreas}
              </div>
              <div className="row gap-2" style={{ marginTop: 5, flexWrap: "wrap" }}>
                {displayedFeedback.topAreas.slice(0, 3).map((a, i) => (
                  <span
                    key={i}
                    className="pill"
                    style={{ background: "var(--surface-sunken)", color: "var(--ink-2)" }}
                  >
                    {i + 1}. {a}
                  </span>
                ))}
              </div>
            </div>
            <button className="btn btn-primary" onClick={() => setChatOpen(true)}>
              <Icon name="sparkles" size={14} /> {t.reviseCoach}
            </button>
          </div>
        )}
      </div>

      {/* Revise-with-coach overlay (Argument coach, streaming) */}
      {chatOpen && displayedFeedback && (
        <ReviseChat
          lang={lang}
          essay={displayedEssay}
          feedback={displayedFeedback}
          onClose={() => setChatOpen(false)}
        />
      )}

      {/* Right: rubric + comments */}
      <div className="col gap-4" style={{ minHeight: 0 }}>
        <div className="card" style={{ padding: 18 }}>
          <div className="row" style={{ justifyContent: "space-between" }}>
            <h4 style={{ margin: 0, fontSize: 14.5, fontWeight: 600 }}>
              {lang === "zh" ? "四項評核" : "Four-criterion scoring"}
            </h4>
            {displayedFeedback && (
              <span className="pill pill-soft">
                {t.band} {displayedFeedback.overallBand.toFixed(1)}
              </span>
            )}
          </div>
          {displayedFeedback ? (
            <div className="col gap-3" style={{ marginTop: 12 }}>
              {(
                [
                  { key: "taskResponse", en: "Task Response", zh: "切題回應" },
                  { key: "cohesion", en: "Coherence & Cohesion", zh: "連貫與銜接" },
                  { key: "lexical", en: "Lexical Resource", zh: "詞彙運用" },
                  { key: "grammar", en: "Grammar Accuracy", zh: "文法準確度" },
                ] as const
              ).map((r) => {
                const v = displayedFeedback.rubric[r.key];
                return (
                  <div key={r.key}>
                    <div className="row" style={{ justifyContent: "space-between", fontSize: 12.5, marginBottom: 5 }}>
                      <span style={{ color: "var(--ink-2)" }}>{r[lang]}</span>
                      <span style={{ fontWeight: 600 }}>{v.toFixed(1)}</span>
                    </div>
                    <Bar pct={(v / 9) * 100} />
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={{ margin: "12px 0 0", fontSize: 13, color: "var(--ink-3)" }}>
              {lang === "zh" ? "提交一篇作文以查看評分。" : "Submit an essay to see scoring."}
            </p>
          )}
        </div>

        <div className="card" style={{ padding: 0, display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
          <div
            className="row"
            style={{
              padding: "14px 18px",
              borderBottom: "1px solid var(--border)",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h4 style={{ margin: 0, fontSize: 14.5, fontWeight: 600 }}>
              {t.inlineComments}{" "}
              <span style={{ color: "var(--ink-3)", fontWeight: 400, marginLeft: 6 }}>
                {displayedFeedback?.annotations.length || 0}
              </span>
            </h4>
            <div className="row gap-2" style={{ flexWrap: "wrap" }}>
              {(["grammar", "lexical", "cohesion", "task"] as const).map((typ) => (
                <span key={typ} className="row gap-2" style={{ fontSize: 11, color: "var(--ink-3)" }}>
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 3,
                      background: `color-mix(in oklch, ${TYPE_COLOR[typ]} 70%, transparent)`,
                    }}
                  />{" "}
                  {lang === "zh"
                    ? typ === "grammar"
                      ? "文法"
                      : typ === "lexical"
                      ? "詞彙"
                      : typ === "cohesion"
                      ? "連貫"
                      : "切題"
                    : typ.charAt(0).toUpperCase() + typ.slice(1)}
                </span>
              ))}
            </div>
          </div>
          <div style={{ overflow: "auto", padding: "8px 0" }}>
            {displayedFeedback?.annotations.map((a, i) => (
              <button
                key={i}
                onClick={() => setActiveId(i)}
                onMouseEnter={() => setActiveId(i)}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "10px 18px",
                  borderLeft: "3px solid " + (activeId === i ? TYPE_COLOR[a.type] : "transparent"),
                  background: activeId === i ? "var(--surface-sunken)" : "transparent",
                }}
              >
                <div className="row gap-2" style={{ alignItems: "center", marginBottom: 4 }}>
                  <span
                    className="pill"
                    style={{
                      background: `color-mix(in oklch, ${TYPE_COLOR[a.type]} 14%, var(--surface))`,
                      color: `color-mix(in oklch, ${TYPE_COLOR[a.type]} 60%, var(--ink))`,
                    }}
                  >
                    {a.type}
                  </span>
                  <span className="mono" style={{ fontSize: 11, color: "var(--ink-3)" }}>
                    &ldquo;{a.text.length > 30 ? a.text.slice(0, 30) + "…" : a.text}&rdquo;
                  </span>
                </div>
                <div style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.5 }}>{a.why}</div>
                {a.fix && (
                  <div style={{ fontSize: 12, color: "var(--good)", marginTop: 4, fontStyle: "italic" }}>
                    → {a.fix}
                  </div>
                )}
              </button>
            ))}
            {displayedFeedback && (
              <div
                style={{
                  margin: "10px 18px",
                  padding: 12,
                  background: "color-mix(in oklch, var(--good) 8%, var(--surface))",
                  border: "1px solid color-mix(in oklch, var(--good) 22%, var(--border))",
                  borderRadius: 6,
                  fontSize: 13,
                  color: "var(--ink-2)",
                  lineHeight: 1.55,
                }}
              >
                <b style={{ color: "var(--good)" }}>{lang === "zh" ? "鼓勵：" : "Encouragement:"}</b>{" "}
                {displayedFeedback.encouragement}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviseChat({
  lang,
  essay,
  feedback,
  onClose,
}: {
  lang: Lang;
  essay: string;
  feedback: WritingFeedback;
  onClose: () => void;
}) {
  const t = L(lang);
  const c = COACH_DATA.argument;
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const summary =
      lang === "zh"
        ? `老師你好。AI 已評改我的 Task 2，分數 ${feedback.overallBand.toFixed(1)}。三大改善重點：${feedback.topAreas.slice(0, 3).join("、")}。請陪我修改首段。`
        : `Hi coach. The AI graded my Task 2 at band ${feedback.overallBand.toFixed(1)}. Top 3 areas to improve: ${feedback.topAreas.slice(0, 3).join("; ")}. Can you help me strengthen the opening paragraph?`;
    return [{ role: "user", content: summary }];
  });
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Auto-send the first message on mount
  const sent = useRef(false);
  if (!sent.current) {
    sent.current = true;
    void send(messages, true);
  }

  async function send(history: ChatMessage[], skipAppend = false) {
    if (!skipAppend) {
      if (!input.trim()) return;
      history = [...history, { role: "user", content: input.trim() }];
      setMessages([...history, { role: "assistant", content: "" }]);
      setInput("");
    } else {
      setMessages([...history, { role: "assistant", content: "" }]);
    }
    setStreaming(true);
    setError(null);
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const augmentedSystem: ChatMessage[] = [
        {
          role: "user",
          content:
            (lang === "zh" ? "以下是 AI 評改的文章內容（給你參考）：\n" : "Here is the essay being revised (for your context):\n") +
            essay,
        },
        ...history,
      ];
      const res = await fetch("/api/coaches/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coachId: "argument", lang, messages: augmentedSystem }),
        signal: controller.signal,
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({ error: "Chat request failed" }));
        throw new Error(j.error || "Chat request failed");
      }
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error("No response stream");
      let buf = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        let nl;
        while ((nl = buf.indexOf("\n\n")) >= 0) {
          const chunk = buf.slice(0, nl).trim();
          buf = buf.slice(nl + 2);
          if (chunk.startsWith("data:")) {
            try {
              const ev = JSON.parse(chunk.replace(/^data:\s*/, ""));
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
              /* ignore */
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
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        width: 400,
        maxWidth: "calc(100vw - 40px)",
        height: 540,
        maxHeight: "calc(100vh - 40px)",
        background: "var(--surface)",
        border: "1px solid var(--border-strong)",
        borderRadius: 12,
        boxShadow: "var(--shadow-lg)",
        display: "flex",
        flexDirection: "column",
        zIndex: 45,
      }}
    >
      <div
        className="row gap-2"
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid var(--border)",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: c.bg,
            color: `oklch(0.34 0.1 ${c.hue})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: 12,
            border: `1px solid oklch(0.86 0.04 ${c.hue})`,
          }}
        >
          {c.initials}
        </div>
        <div className="grow">
          <div className="eyebrow" style={{ color: `oklch(0.45 0.1 ${c.hue})`, fontSize: 9 }}>
            {lang === "zh" ? c.stageZh : c.stageEn}
          </div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{c.name[lang]}</div>
        </div>
        <button className="btn-ghost" onClick={onClose} style={{ width: 26, height: 26, borderRadius: 6 }}>
          <Icon name="x" size={14} />
        </button>
      </div>
      <div style={{ flex: 1, overflow: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
        {messages.map((m, i) => (
          <div
            key={i}
            className="row gap-2"
            style={{
              flexDirection: m.role === "user" ? "row-reverse" : "row",
              alignItems: "flex-end",
            }}
          >
            <div className={`bubble ${m.role === "user" ? "bubble-user" : "bubble-bot"}`} style={{ fontSize: 13, padding: "10px 12px" }}>
              {m.content || (streaming && i === messages.length - 1 ? <em style={{ opacity: 0.5 }}>{t.coachThinking}</em> : "")}
            </div>
          </div>
        ))}
        {error && (
          <div style={{ padding: 8, fontSize: 11, color: "var(--bad)" }}>
            <Icon name="warn" size={11} /> {error}
          </div>
        )}
      </div>
      <div className="row gap-2" style={{ padding: 12, borderTop: "1px solid var(--border)" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send(messages.filter((m) => m.content));
            }
          }}
          placeholder={t.askCoach}
          disabled={streaming}
          style={{
            flex: 1,
            padding: "8px 12px",
            border: "1px solid var(--border-strong)",
            borderRadius: 6,
            fontSize: 13,
            background: "var(--surface)",
            color: "var(--ink)",
          }}
        />
        <button
          className="btn btn-primary"
          style={{ padding: "8px 12px" }}
          onClick={() => send(messages.filter((m) => m.content))}
          disabled={streaming || !input.trim()}
        >
          <Icon name="send" size={12} />
        </button>
      </div>
    </div>
  );
}
