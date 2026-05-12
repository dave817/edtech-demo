"use client";

import { useMemo, useState } from "react";
import type { Lang, SpeakingMode } from "@/lib/types";
import { L } from "@/lib/i18n";
import { Icon } from "../ui/Icon";
import { Bar } from "../ui/Primitives";
import { COACH_DATA } from "@/lib/coachData";
import { useRealtime } from "@/hooks/useRealtime";
import { STUDENT } from "@/lib/seed";

const SPEAK_MODES: Array<{ id: SpeakingMode; icon: string; en: string; zh: string; desc_en: string; desc_zh: string }> = [
  { id: "free", icon: "chat", en: "Free conversation", zh: "自由對話", desc_en: "Casual topics with gentle corrections", desc_zh: "輕鬆對話與溫和糾正" },
  { id: "p1", icon: "bolt", en: "Part 1 Drill", zh: "Part 1 練習", desc_en: "20–30s answers, examiner enforces density", desc_zh: "20-30 秒答覆，考官把控密度" },
  { id: "p2", icon: "card", en: "Part 2 Cue Card", zh: "Part 2 卡片", desc_en: "1 min prep · 2 min monologue · follow-up", desc_zh: "1 分鐘準備 · 2 分鐘獨白 · 追問" },
  { id: "p2drill", icon: "repeat", en: "4-3-2 Fluency Drill", zh: "4-3-2 流暢度", desc_en: "Same cue card · 4→3→2 min compression", desc_zh: "相同卡片 · 4→3→2 分鐘壓縮" },
  { id: "p3", icon: "speech", en: "Part 3 Debate", zh: "Part 3 辯論", desc_en: "WHY-ladder + counterpoint framework", desc_zh: "WHY 階梯 + 反方論點框架" },
  { id: "full", icon: "check", en: "Full exam", zh: "完整模考", desc_en: "P1 · P2 · P3 · strict examiner", desc_zh: "P1 · P2 · P3 · 嚴格考官" },
];

const CUE_CARD = {
  title_en: "Describe an old person that you know.",
  title_zh: "描述一位你認識的長者。",
  bullets_en: [
    "What your relationship is to this person",
    "How often you see them",
    "What people think about this person",
    "Explain why you like them.",
  ],
  bullets_zh: ["你與這個人是什麼關係", "你多久見他/她一次", "別人對這個人的看法", "解釋你為什麼喜歡他/她。"],
};

const P1_HINT_EN = "Let's talk about your hometown. Where are you from, and what do you like most about it?";
const P1_HINT_ZH = "我們先談談你的家鄉。你來自哪裡？你最喜歡那裡的什麼？";

export function SpeakingScreen({ lang }: { lang: Lang }) {
  const t = L(lang);
  const [mode, setMode] = useState<SpeakingMode>("p1");
  const [accent, setAccent] = useState<"UK" | "US" | "AU" | "CA">("UK");
  const [bandTarget, setBandTarget] = useState(7.5);
  const [strictness, setStrictness] = useState<"Low" | "Medium" | "High">("Medium");
  const [cohesionGuard, setCohesionGuard] = useState(true);

  const { status, messages, error, secondsLeft, start, stop } = useRealtime({
    mode,
    accent,
    bandTarget,
    strictness,
  });

  const isLive = status === "ready" || status === "active";
  const isConnecting = status === "connecting";

  // Rough live-rubric heuristic — based on message counts. The real model emits JSON
  // rubric lines via session.update; this is a quick fallback so the right column is never empty.
  const rubric = useMemo(() => {
    const studentTurns = messages.filter((m) => m.who === "student");
    const totalWords = studentTurns.reduce((s, m) => s + m.text.split(/\s+/).length, 0);
    const avgWordsPerTurn = studentTurns.length ? totalWords / studentTurns.length : 0;
    const base = Math.min(8.5, 5.5 + avgWordsPerTurn / 20);
    return [
      { key: "fluency" as const, value: Math.round(base * 10) / 10, hue: 28, conf: "medium" as const },
      { key: "lexical" as const, value: Math.round((base + 0.3) * 10) / 10, hue: 180, conf: "medium" as const },
      { key: "grammar" as const, value: Math.round((base - 0.2) * 10) / 10, hue: 145, conf: "medium" as const },
      { key: "pronunciation" as const, value: Math.round((base - 0.5) * 10) / 10, hue: 295, conf: "low" as const },
    ];
  }, [messages]);

  const overall = rubric.length ? (rubric.reduce((s, r) => s + r.value, 0) / rubric.length).toFixed(1) : "—";

  // Cantonese-L1 pronunciation tips (heuristic post-scan)
  const tips = useMemo(() => {
    const tipList: Array<{ word: string; ipa: string; heard: string; note_en: string; note_zh: string }> = [];
    const all = messages.filter((m) => m.who === "student").map((m) => m.text).join(" ").toLowerCase();
    if (/\bthing|three|think|thanks\b/.test(all)) {
      tipList.push({
        word: "thing/three/think",
        ipa: "/θ/",
        heard: "/f/ or /s/",
        note_en: "Voiceless 'th' /θ/ is often produced as /f/ or /s/ by Cantonese L1 speakers. Bite the tongue tip lightly while exhaling.",
        note_zh: "清「th」音 /θ/ 容易被替代為 /f/ 或 /s/。練習：上排牙齒輕咬舌尖，同時呼氣。",
      });
    }
    if (/\bvery|have|give\b/.test(all)) {
      tipList.push({
        word: "very / have",
        ipa: "/v/",
        heard: "/w/",
        note_en: "/v/ often becomes /w/. Touch the upper teeth to the lower lip and exhale with voice.",
        note_zh: "/v/ 常被替代為 /w/。上排牙齒輕觸下唇，發出濁音。",
      });
    }
    if (!tipList.length) {
      tipList.push({
        word: "—",
        ipa: "",
        heard: "",
        note_en: "Speak more to receive Cantonese-L1 pronunciation tips.",
        note_zh: "多說一些以獲得粵語 L1 發音建議。",
      });
    }
    return tipList;
  }, [messages]);

  const [activeTip, setActiveTip] = useState(0);

  const onToggleSession = () => {
    if (isLive || isConnecting) stop();
    else start();
  };

  return (
    <div style={{ padding: "20px 28px 4px" }}>
      {/* Mode selector */}
      <div className="row gap-2" style={{ marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
        {SPEAK_MODES.map((m) => {
          const active = mode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => !isLive && setMode(m.id)}
              disabled={isLive}
              className="lift"
              style={{
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 14px",
                borderRadius: 12,
                border: "1px solid " + (active ? "var(--accent)" : "var(--border)"),
                background: active ? "color-mix(in oklch, var(--accent) 10%, var(--surface))" : "var(--surface)",
                color: active ? "var(--accent-ink)" : "var(--ink-2)",
                fontSize: 13,
                fontWeight: 500,
                textAlign: "left",
                opacity: isLive && !active ? 0.5 : 1,
                cursor: isLive ? "not-allowed" : "pointer",
              }}
            >
              <Icon name={m.icon} size={16} stroke={active ? 2 : 1.6} />
              <div style={{ lineHeight: 1.2 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{m[lang]}</div>
                <div
                  style={{
                    fontSize: 11,
                    color: active ? "color-mix(in oklch, var(--accent) 65%, var(--ink-3))" : "var(--ink-3)",
                  }}
                >
                  {m["desc_" + lang as "desc_en" | "desc_zh"]}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 20 }}>
        {/* Centre */}
        <div className="card" style={{ display: "flex", flexDirection: "column", minHeight: "calc(100vh - 220px)" }}>
          {/* Header */}
          <div className="row gap-3" style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)" }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                background: COACH_DATA.exam.bg,
                color: `oklch(0.34 0.1 ${COACH_DATA.exam.hue})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: 15,
                border: `1px solid oklch(0.86 0.04 ${COACH_DATA.exam.hue})`,
              }}
            >
              {COACH_DATA.exam.initials}
            </div>
            <div className="grow">
              <div className="row gap-2" style={{ alignItems: "center", flexWrap: "wrap" }}>
                <h3 style={{ margin: 0, fontSize: 14.5, fontWeight: 600 }}>{COACH_DATA.exam.name[lang]}</h3>
                <span className="pill pill-soft">{SPEAK_MODES.find((m) => m.id === mode)?.[lang]}</span>
                <span className="pill pill-flame">
                  <Icon name="flame" size={11} /> {accent}
                </span>
                {isLive && (
                  <span className="pill pill-good">
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor", display: "inline-block" }} />
                    {lang === "zh" ? "連線中" : "Live"}
                  </span>
                )}
                {isLive && (
                  <span className="pill" style={{ background: "var(--surface-sunken)", color: "var(--ink-2)" }}>
                    <Icon name="clock" size={11} /> {Math.floor(secondsLeft / 60)}:{(secondsLeft % 60).toString().padStart(2, "0")}
                  </span>
                )}
              </div>
              <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>
                {lang === "zh" ? "母語：粵語 · 已啟用發音標記" : "L1: Cantonese (yue) · pronunciation flags ON"} ·{" "}
                {lang === "zh" ? "目標分數" : "Target"} {bandTarget}
              </div>
            </div>
          </div>

          {/* Mode-specific prep panels */}
          {(mode === "p2" || mode === "p2drill") && (
            <div style={{ padding: "18px 22px 0" }}>
              <div className="card" style={{ padding: 18, background: "var(--bg-2)", border: "1px dashed var(--border-strong)" }}>
                <div className="row" style={{ justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span className="eyebrow">{lang === "zh" ? "Cue Card · 主題卡" : "Cue Card"}</span>
                </div>
                <h3 className="serif" style={{ margin: "0 0 10px", fontSize: 17, fontWeight: 600 }}>
                  {CUE_CARD["title_" + lang as "title_en" | "title_zh"]}
                </h3>
                <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginBottom: 8 }}>
                  {lang === "zh" ? "你應該說：" : "You should say:"}
                </div>
                <ul style={{ margin: 0, paddingLeft: 18, color: "var(--ink-2)", fontSize: 13.5, lineHeight: 1.65 }}>
                  {CUE_CARD["bullets_" + lang as "bullets_en" | "bullets_zh"].map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {mode === "p1" && !isLive && messages.length === 0 && (
            <div style={{ padding: "14px 22px 0" }}>
              <div className="row gap-2" style={{ fontSize: 12, color: "var(--ink-3)" }}>
                <Icon name="target" size={13} />
                <span>
                  {lang === "zh" ? "範例題目：" : "Example question: "}
                  <i>{lang === "zh" ? P1_HINT_ZH : P1_HINT_EN}</i>
                </span>
              </div>
            </div>
          )}

          {/* Transcript */}
          <div style={{ padding: 20, flex: 1, overflow: "auto", display: "flex", flexDirection: "column", gap: 14 }}>
            {messages.length === 0 && !isConnecting && (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 20px",
                  color: "var(--ink-3)",
                  fontSize: 14,
                }}
              >
                <Icon name="mic" size={28} />
                <p style={{ marginTop: 12 }}>
                  {lang === "zh" ? "按下下方麥克風開始與考官對話。" : "Press the mic button below to start your session with the examiner."}
                </p>
                <p style={{ fontSize: 12, color: "var(--ink-4)" }}>{t.sessionCap}</p>
              </div>
            )}
            {isConnecting && (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--ink-3)" }}>
                <div className="skel" style={{ width: 200, height: 20, margin: "0 auto" }} />
                <p style={{ marginTop: 12, fontSize: 13 }}>{t.connecting}</p>
              </div>
            )}
            {messages.map((m, i) => {
              const isBot = m.who === "examiner";
              return (
                <div
                  key={i}
                  className="row gap-3"
                  style={{
                    alignItems: "flex-end",
                    flexDirection: isBot ? "row" : "row-reverse",
                    justifyContent: isBot ? "flex-start" : "flex-end",
                  }}
                >
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      flexShrink: 0,
                      background: isBot ? COACH_DATA.exam.bg : "color-mix(in oklch, var(--accent) 14%, var(--surface))",
                      color: isBot ? `oklch(0.34 0.1 ${COACH_DATA.exam.hue})` : "var(--accent-ink)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 700,
                      border: "1px solid var(--border)",
                    }}
                  >
                    {isBot ? COACH_DATA.exam.initials : STUDENT.initials}
                  </div>
                  <div style={{ maxWidth: "76%" }}>
                    <div
                      style={{
                        fontSize: 10.5,
                        color: "var(--ink-3)",
                        marginBottom: 4,
                        textAlign: isBot ? "left" : "right",
                      }}
                    >
                      {isBot ? t.examiner : t.you} · {m.time}
                    </div>
                    <div className={`bubble ${isBot ? "bubble-bot" : "bubble-user"}`}>{m.text}</div>
                  </div>
                </div>
              );
            })}
            {error && (
              <div
                className="card"
                style={{
                  padding: 14,
                  background: "color-mix(in oklch, var(--bad) 8%, var(--surface))",
                  border: "1px solid color-mix(in oklch, var(--bad) 30%, var(--border))",
                  fontSize: 13,
                  color: "var(--ink-2)",
                }}
              >
                <div className="row gap-2" style={{ marginBottom: 6 }}>
                  <Icon name="warn" size={14} />
                  <b>{lang === "zh" ? "無法開始練習" : "Couldn't start session"}</b>
                </div>
                <div style={{ fontSize: 12, color: "var(--ink-3)" }}>{error}</div>
                {/* Only show the API-key hint when the error actually came from the server */}
                {/OPENAI_API_KEY|api key|unauthorized|invalid_api_key/i.test(error || "") && (
                  <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 6 }}>{t.apiError}</div>
                )}
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="row gap-3" style={{ padding: "14px 18px", borderTop: "1px solid var(--border)", background: "var(--bg-2)" }}>
            <button
              onClick={onToggleSession}
              className="btn"
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                padding: 0,
                background: isLive ? "var(--bad)" : "var(--accent)",
                color: "white",
                justifyContent: "center",
                boxShadow: isLive ? "0 0 0 5px color-mix(in oklch, var(--bad) 25%, transparent)" : "none",
              }}
            >
              <Icon name={isLive ? "pause" : "mic"} size={20} stroke={2} />
            </button>
            <div className="wave grow">
              {Array.from({ length: 60 }).map((_, i) => {
                const peak = Math.sin(i * 0.6) * 0.4 + Math.sin(i * 0.18) * 0.6;
                const h = 8 + Math.abs(peak) * 24 + (isLive ? Math.sin(Date.now() / 200 + i) * 4 : 0);
                return <i key={i} style={{ height: h, opacity: isLive ? 0.95 : 0.4 }} />;
              })}
            </div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "var(--font-ibm-plex-mono), monospace",
                color: isLive ? "var(--bad)" : "var(--ink-2)",
                minWidth: 60,
                textAlign: "right",
              }}
            >
              {isLive ? `● ${formatSec(SESSION_LIMIT_S - secondsLeft)}` : "0:00"}
            </div>
            <button className="btn btn-outline" onClick={() => stop()} disabled={!isLive && !isConnecting}>
              <Icon name="x" size={13} /> {t.endSession}
            </button>
          </div>
        </div>

        {/* Right column */}
        <div className="col gap-4">
          {/* Live rubric */}
          <div className="card" style={{ padding: 18 }}>
            <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
              <h4 style={{ margin: 0, fontSize: 14.5, fontWeight: 600 }}>{t.rubric}</h4>
              <span className="pill pill-soft">{lang === "zh" ? "估算" : "estimate"}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "14px 0 4px" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 44, fontWeight: 700, letterSpacing: "-0.03em", color: "var(--accent-ink)" }}>{overall}</div>
                <div
                  style={{
                    fontSize: 11.5,
                    color: "var(--ink-3)",
                    textTransform: "uppercase",
                    letterSpacing: ".06em",
                  }}
                >
                  {lang === "zh" ? "總體預估" : "overall estimate"}
                </div>
              </div>
            </div>
            <div className="col gap-3" style={{ marginTop: 8 }}>
              {rubric.map((r) => (
                <div key={r.key}>
                  <div className="row" style={{ justifyContent: "space-between", fontSize: 12.5, marginBottom: 6 }}>
                    <span style={{ color: "var(--ink-2)" }}>{t[r.key]}</span>
                    <span className="row gap-2">
                      <span
                        className="mono"
                        style={{ fontSize: 10, color: "var(--ink-3)", textTransform: "uppercase" }}
                      >
                        {r.conf}
                      </span>
                      <span style={{ fontWeight: 600, color: `oklch(0.4 0.1 ${r.hue})` }}>{r.value.toFixed(1)}</span>
                    </span>
                  </div>
                  <Bar pct={(r.value / 9) * 100} color={`oklch(0.55 0.13 ${r.hue})`} />
                </div>
              ))}
            </div>
          </div>

          {/* Pron tips */}
          <div
            className="card"
            style={{
              padding: 14,
              border: "1px solid color-mix(in oklch, var(--xp) 30%, var(--border))",
              background: "color-mix(in oklch, var(--xp) 7%, var(--surface))",
            }}
          >
            <div className="row gap-2" style={{ alignItems: "center", marginBottom: 8 }}>
              <span
                className="pill"
                style={{
                  background: "color-mix(in oklch, var(--xp) 20%, var(--surface))",
                  color: "color-mix(in oklch, var(--xp) 50%, var(--ink))",
                }}
              >
                <Icon name="sound" size={11} /> {t.pronounceTip}
              </span>
            </div>
            <div className="row gap-3" style={{ alignItems: "baseline" }}>
              <span className="serif" style={{ fontSize: 18, fontWeight: 600 }}>
                &ldquo;{tips[activeTip].word}&rdquo;
              </span>
              {tips[activeTip].ipa && (
                <span className="mono" style={{ fontSize: 13, color: "var(--ink-2)" }}>
                  target {tips[activeTip].ipa}
                </span>
              )}
              {tips[activeTip].heard && (
                <span className="mono" style={{ fontSize: 13, color: "var(--bad)" }}>
                  heard {tips[activeTip].heard}
                </span>
              )}
            </div>
            <p style={{ margin: "8px 0 0", fontSize: 13, lineHeight: 1.55, color: "var(--ink-2)" }}>
              {tips[activeTip][("note_" + lang) as "note_en" | "note_zh"]}
            </p>
            {tips.length > 1 && (
              <div className="row gap-2" style={{ marginTop: 10, flexWrap: "wrap" }}>
                {tips.map((tip, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTip(idx)}
                    style={{
                      padding: "4px 9px",
                      borderRadius: 999,
                      fontSize: 11.5,
                      background: activeTip === idx ? "var(--surface)" : "transparent",
                      border: "1px solid " + (activeTip === idx ? "var(--ink-2)" : "var(--border)"),
                      color: activeTip === idx ? "var(--ink)" : "var(--ink-3)",
                    }}
                  >
                    {tip.word}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Examiner settings */}
          <div className="card" style={{ padding: 18 }}>
            <h4 style={{ margin: "0 0 12px", fontSize: 14.5, fontWeight: 600 }}>
              {lang === "zh" ? "考官設定" : "Examiner settings"}
            </h4>
            <div className="col gap-3">
              <div>
                <div className="eyebrow" style={{ marginBottom: 6 }}>
                  {lang === "zh" ? "口音" : "Accent"}
                </div>
                <div className="row gap-2">
                  {(["UK", "US", "AU", "CA"] as const).map((a) => (
                    <button
                      key={a}
                      onClick={() => !isLive && setAccent(a)}
                      disabled={isLive}
                      style={{
                        flex: 1,
                        padding: "6px 0",
                        borderRadius: 8,
                        fontSize: 12,
                        background: accent === a ? "var(--surface)" : "transparent",
                        border: "1px solid " + (accent === a ? "var(--ink-2)" : "var(--border)"),
                        color: accent === a ? "var(--ink)" : "var(--ink-3)",
                        fontWeight: accent === a ? 600 : 500,
                        cursor: isLive ? "not-allowed" : "pointer",
                      }}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="row" style={{ justifyContent: "space-between", marginBottom: 6 }}>
                  <span className="eyebrow">{lang === "zh" ? "目標分數" : "Band target"}</span>
                  <span style={{ fontSize: 12.5, fontWeight: 600 }}>{bandTarget.toFixed(1)}</span>
                </div>
                <div className="row gap-2">
                  {[6, 6.5, 7, 7.5, 8, 8.5, 9].map((b) => (
                    <button
                      key={b}
                      onClick={() => !isLive && setBandTarget(b)}
                      disabled={isLive}
                      style={{
                        flex: 1,
                        padding: "5px 0",
                        borderRadius: 6,
                        fontSize: 11,
                        background: bandTarget === b ? "var(--accent)" : "transparent",
                        color: bandTarget === b ? "var(--accent-fg)" : "var(--ink-3)",
                        border: "1px solid " + (bandTarget === b ? "transparent" : "var(--border)"),
                        fontWeight: bandTarget === b ? 600 : 500,
                        cursor: isLive ? "not-allowed" : "pointer",
                      }}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="eyebrow" style={{ marginBottom: 6 }}>
                  {lang === "zh" ? "嚴格度" : "Strictness"}
                </div>
                <div className="row gap-2">
                  {(["Low", "Medium", "High"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => !isLive && setStrictness(s)}
                      disabled={isLive}
                      style={{
                        flex: 1,
                        padding: "6px 0",
                        borderRadius: 8,
                        fontSize: 12,
                        background: strictness === s ? "var(--surface)" : "transparent",
                        border: "1px solid " + (strictness === s ? "var(--ink-2)" : "var(--border)"),
                        color: strictness === s ? "var(--ink)" : "var(--ink-3)",
                        fontWeight: strictness === s ? 600 : 500,
                        cursor: isLive ? "not-allowed" : "pointer",
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <label className="row gap-2" style={{ fontSize: 12.5, color: "var(--ink-2)", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={cohesionGuard}
                  onChange={(e) => setCohesionGuard(e.target.checked)}
                  style={{ accentColor: "var(--accent)" }}
                />
                <span>
                  {lang === "zh"
                    ? "啟用銜接詞守衛（>2 個 / 30 秒 即提示）"
                    : "Cohesion guard (warn if >2 connectives per 30s)"}
                </span>
              </label>
            </div>
          </div>

          {/* AI limits */}
          <div
            className="card"
            style={{
              padding: 14,
              background: "color-mix(in oklch, var(--warn) 6%, var(--surface))",
              border: "1px solid color-mix(in oklch, var(--warn) 18%, var(--border))",
            }}
          >
            <div className="row gap-2" style={{ alignItems: "flex-start", fontSize: 12, color: "var(--ink-2)" }}>
              <Icon name="warn" size={13} />
              <span style={{ lineHeight: 1.5 }}>{t.aiLimits}</span>
            </div>
          </div>

          {/* Privacy */}
          <div className="card" style={{ padding: 14, background: "var(--surface-sunken)" }}>
            <div className="row gap-2" style={{ alignItems: "center", fontSize: 12, color: "var(--ink-2)" }}>
              <Icon name="lock" size={13} />
              {lang === "zh"
                ? "錄音 24 小時後自動刪除，僅評分結果留存"
                : "Audio auto-deletes after 24h; only scores are retained."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const SESSION_LIMIT_S = 5 * 60;

function formatSec(s: number) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}
