"use client";

import { useState } from "react";
import type { Tweaks, Lang, Route } from "@/lib/types";
import { Icon } from "./ui/Icon";

interface TweaksPanelProps {
  tweaks: Tweaks;
  setTweak: <K extends keyof Tweaks>(key: K, value: Tweaks[K]) => void;
  setRoute: (r: Route) => void;
  route: Route;
}

const ACCENTS: Array<{ id: Tweaks["accent"]; swatch: string; label: string }> = [
  { id: "teal", swatch: "oklch(0.40 0.115 22)", label: "Oxblood" },
  { id: "coral", swatch: "oklch(0.48 0.14 32)", label: "Brick" },
  { id: "aubergine", swatch: "oklch(0.36 0.075 155)", label: "Forest" },
];

const PROVIDERS: Tweaks["aiProvider"][] = ["Claude", "OpenAI", "Gemini", "On-prem Llama"];

const REGIONS = [
  "Hong Kong (asia-east2)",
  "Singapore (asia-southeast1)",
  "Tokyo (asia-northeast1)",
  "EU (europe-west4)",
];

const JUMP: Array<{ id: Route; en: string; zh: string }> = [
  { id: "today", en: "Today", zh: "今日" },
  { id: "coaches", en: "Coaches", zh: "教練" },
  { id: "speaking", en: "Speaking", zh: "口說" },
  { id: "writing", en: "Writing", zh: "寫作" },
  { id: "teacher", en: "Class", zh: "班級" },
  { id: "pron", en: "Pron Lab", zh: "發音" },
];

export function TweaksPanel({ tweaks, setTweak, setRoute, route }: TweaksPanelProps) {
  const [open, setOpen] = useState(false);
  const lang: Lang = tweaks.lang;

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        title={lang === "zh" ? "示範控制" : "Demo controls"}
        style={{
          position: "fixed",
          bottom: 18,
          right: 18,
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: "var(--ink)",
          color: "var(--bg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "var(--shadow-lg)",
          zIndex: 40,
          border: "2px solid var(--bg)",
        }}
      >
        <Icon name="sparkles" size={18} stroke={2} />
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(20,18,12,.25)",
            zIndex: 50,
            display: "flex",
            justifyContent: "flex-end",
            backdropFilter: "blur(2px)",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 320,
              height: "100vh",
              background: "var(--surface)",
              borderLeft: "1px solid var(--border)",
              overflow: "auto",
              padding: 22,
              display: "flex",
              flexDirection: "column",
              gap: 18,
            }}
          >
            <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div className="eyebrow">{lang === "zh" ? "示範控制" : "Demo controls"}</div>
                <h3 className="serif" style={{ margin: "2px 0 0", fontSize: 18, fontWeight: 600 }}>
                  {lang === "zh" ? "客製化" : "Customise"}
                </h3>
              </div>
              <button
                className="btn-ghost"
                onClick={() => setOpen(false)}
                aria-label="Close demo controls"
                style={{ width: 44, height: 44, display: "inline-flex", alignItems: "center", justifyContent: "center" }}
              >
                <Icon name="x" size={18} />
              </button>
            </div>

            <Section label={lang === "zh" ? "主色" : "Accent"}>
              <div className="row gap-2">
                {ACCENTS.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setTweak("accent", a.id)}
                    title={a.label}
                    style={{
                      flex: 1,
                      height: 44,
                      borderRadius: 4,
                      background: a.swatch,
                      border: "2px solid " + (tweaks.accent === a.id ? "var(--ink)" : "transparent"),
                      cursor: "pointer",
                    }}
                  />
                ))}
              </div>
            </Section>

            <Section label={lang === "zh" ? "深色模式" : "Dark mode"}>
              <div className="row gap-2">
                {[
                  { id: false, label_en: "Light", label_zh: "淺色", icon: "sun" },
                  { id: true, label_en: "Dark", label_zh: "深色", icon: "moon" },
                ].map((o) => (
                  <button
                    key={String(o.id)}
                    onClick={() => setTweak("dark", o.id)}
                    style={{
                      flex: 1,
                      padding: "8px 12px",
                      borderRadius: 6,
                      border: "1px solid " + (tweaks.dark === o.id ? "var(--ink-2)" : "var(--border)"),
                      background: tweaks.dark === o.id ? "var(--surface)" : "transparent",
                      color: tweaks.dark === o.id ? "var(--ink)" : "var(--ink-3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                      fontSize: 13,
                      fontWeight: 500,
                    }}
                  >
                    <Icon name={o.icon} size={14} />
                    {lang === "zh" ? o.label_zh : o.label_en}
                  </button>
                ))}
              </div>
            </Section>

            <Section label={lang === "zh" ? "AI 供應商" : "AI provider"}>
              <select
                value={tweaks.aiProvider}
                onChange={(e) => setTweak("aiProvider", e.target.value as Tweaks["aiProvider"])}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: 6,
                  border: "1px solid var(--border-strong)",
                  background: "var(--surface)",
                  fontSize: 13,
                }}
              >
                {PROVIDERS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <p style={{ margin: "8px 0 0", fontSize: 11.5, color: "var(--ink-3)", lineHeight: 1.5 }}>
                {lang === "zh"
                  ? "可切換 AI 模型。實際呼叫由 OPENAI_API_KEY 決定。"
                  : "Procurement signal. Actual model used is set by OPENAI_API_KEY."}
              </p>
            </Section>

            <Section label={lang === "zh" ? "資料儲存地" : "Data region"}>
              <select
                value={tweaks.region}
                onChange={(e) => setTweak("region", e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: 6,
                  border: "1px solid var(--border-strong)",
                  background: "var(--surface)",
                  fontSize: 13,
                }}
              >
                {REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </Section>

            <Section label={lang === "zh" ? "快速跳轉" : "Jump to screen"}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 6 }}>
                {JUMP.map((j) => (
                  <button
                    key={j.id}
                    onClick={() => {
                      setRoute(j.id);
                      setOpen(false);
                    }}
                    style={{
                      padding: "7px 9px",
                      borderRadius: 6,
                      fontSize: 12,
                      background: route === j.id ? "color-mix(in oklch, var(--accent) 14%, var(--surface))" : "var(--surface-sunken)",
                      color: route === j.id ? "var(--accent-ink)" : "var(--ink-2)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    {lang === "zh" ? j.zh : j.en}
                  </button>
                ))}
              </div>
            </Section>

            <div
              style={{
                marginTop: "auto",
                padding: 12,
                background: "var(--surface-sunken)",
                borderRadius: 6,
                fontSize: 11.5,
                color: "var(--ink-3)",
                lineHeight: 1.5,
              }}
            >
              <Icon name="badge" size={12} />{" "}
              {lang === "zh"
                ? "示範原型 — 給校方委員會技術評估使用。"
                : "Demo prototype — for EdTech committee technical review."}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div
        style={{
          fontSize: 10.5,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--ink-3)",
          fontWeight: 600,
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      {children}
    </div>
  );
}
