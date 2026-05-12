"use client";

import { useState } from "react";
import type { Lang } from "@/lib/types";
import { L } from "@/lib/i18n";
import { Icon } from "../ui/Icon";

const PHONEMES = [
  {
    ipa: "/θ/",
    examples: ["think", "three", "thing", "thanks"],
    substitutes: ["/f/", "/s/"],
    tip_en: "Place the tongue tip between your teeth and exhale. Voiceless — no buzz in the throat.",
    tip_zh: "舌尖放在上下齒之間，呼氣。清音 — 喉嚨沒有震動。",
    hue: 295,
  },
  {
    ipa: "/ð/",
    examples: ["this", "that", "mother", "with"],
    substitutes: ["/d/", "/z/"],
    tip_en: "Same tongue position as /θ/, but voiced — feel the buzz in the throat.",
    tip_zh: "舌頭位置與 /θ/ 相同，但是濁音 — 感受喉嚨的震動。",
    hue: 28,
  },
  {
    ipa: "/v/",
    examples: ["very", "give", "have", "voice"],
    substitutes: ["/w/", "/f/"],
    tip_en: "Upper teeth gently touch the lower lip and exhale with voice. Not /w/ — your teeth must contact your lip.",
    tip_zh: "上排牙齒輕觸下唇，發出濁音。不是 /w/ — 牙齒必須碰到唇。",
    hue: 180,
  },
  {
    ipa: "/r/",
    examples: ["red", "very", "narrow", "around"],
    substitutes: ["/l/", "/w/"],
    tip_en: "Curl the tongue tip back without touching the roof of the mouth. Lips slightly rounded.",
    tip_zh: "舌尖向後捲，但不接觸上顎。雙唇微微圓起。",
    hue: 145,
  },
];

export function PronScreen({ lang }: { lang: Lang }) {
  const t = L(lang);
  const [active, setActive] = useState(0);
  const p = PHONEMES[active];
  return (
    <div style={{ padding: "24px 28px 8px" }}>
      <div style={{ marginBottom: 20, maxWidth: 720 }}>
        <div className="eyebrow">{lang === "zh" ? "粵語音系缺少的英語音" : "Sounds absent from Cantonese phonology"}</div>
        <h2 style={{ margin: "4px 0 6px", fontSize: 24, fontWeight: 600 }}>{t.pronLab}</h2>
        <p style={{ margin: 0, color: "var(--ink-2)", fontSize: 14, lineHeight: 1.55 }}>{t.pronSub}</p>
      </div>

      <div className="split-phoneme">
        <div className="col gap-2">
          {PHONEMES.map((ph, i) => (
            <button
              key={ph.ipa}
              onClick={() => setActive(i)}
              className="card lift"
              style={{
                padding: "14px 16px",
                textAlign: "left",
                border: "1px solid " + (active === i ? "var(--ink-2)" : "var(--border)"),
                background: active === i ? "var(--surface)" : "transparent",
              }}
            >
              <div className="row gap-3" style={{ alignItems: "center" }}>
                <span
                  className="mono"
                  style={{
                    fontSize: 22,
                    fontWeight: 600,
                    color: `oklch(0.4 0.12 ${ph.hue})`,
                    minWidth: 50,
                  }}
                >
                  {ph.ipa}
                </span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: "var(--ink)" }}>
                    {ph.examples.slice(0, 2).join(", ")}…
                  </div>
                  <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 2 }}>
                    {lang === "zh" ? "常被替代為" : "often replaced by"} {ph.substitutes.join(", ")}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="card" style={{ padding: 26 }}>
          <div className="eyebrow">{lang === "zh" ? "練習" : "Drill"}</div>
          <div className="row gap-3" style={{ alignItems: "baseline", marginTop: 6 }}>
            <span className="mono" style={{ fontSize: 56, fontWeight: 600, color: `oklch(0.4 0.12 ${p.hue})`, lineHeight: 1 }}>
              {p.ipa}
            </span>
            <span style={{ fontSize: 14, color: "var(--ink-3)" }}>
              {lang === "zh" ? "粵語通常替代為" : "Cantonese learners often substitute"}{" "}
              <b style={{ color: "var(--bad)" }}>{p.substitutes.join(" or ")}</b>
            </span>
          </div>

          <h3 style={{ margin: "20px 0 8px", fontSize: 14, fontWeight: 600 }}>
            {lang === "zh" ? "字例" : "Example words"}
          </h3>
          <div className="row gap-2" style={{ flexWrap: "wrap" }}>
            {p.examples.map((w) => (
              <span
                key={w}
                className="serif"
                style={{ padding: "6px 12px", fontSize: 16, background: "var(--surface-sunken)", border: "1px solid var(--border)", borderRadius: 4 }}
              >
                {w}
              </span>
            ))}
          </div>

          <h3 style={{ margin: "20px 0 8px", fontSize: 14, fontWeight: 600 }}>
            {lang === "zh" ? "發音提示" : "Articulation tip"}
          </h3>
          <p style={{ margin: 0, fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.6 }}>{lang === "zh" ? p.tip_zh : p.tip_en}</p>

          <div className="wave" style={{ marginTop: 24, height: 48 }}>
            {Array.from({ length: 80 }).map((_, i) => {
              const h = 8 + Math.abs(Math.sin(i * 0.5) * 0.6 + Math.sin(i * 0.18) * 0.4) * 28;
              return <i key={i} style={{ height: h, opacity: 0.55 }} />;
            })}
          </div>

          <div className="row gap-3" style={{ marginTop: 24, justifyContent: "flex-end" }}>
            <button className="btn btn-outline">
              <Icon name="sound" size={13} /> {lang === "zh" ? "聆聽示範" : "Hear model"}
            </button>
            <button className="btn btn-primary">
              <Icon name="mic" size={13} /> {lang === "zh" ? "錄音對比" : "Record & compare"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
