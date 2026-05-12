"use client";

import { useEffect, useState } from "react";
import type { Lang } from "@/lib/types";
import { Icon } from "./ui/Icon";

const STORAGE_KEY = "lumen_onboarded";

interface Step {
  icon: string;
  title_en: string;
  title_zh: string;
  body_en: string;
  body_zh: string;
}

const STEPS: Step[] = [
  {
    icon: "chart",
    title_en: "Regularity, not streak",
    title_zh: "規律，而非連續紀錄",
    body_en:
      "The headline number is the % of past days you actually practised. Miss a day — no shame, no streak to break. Show up most days and the percentage takes care of itself.",
    body_zh:
      "首頁顯示的數字是「最近練習日數佔比」，不是連續打卡。漏一天不會歸零，重點在於持續出現。",
  },
  {
    icon: "panel",
    title_en: "Three groups of activities",
    title_zh: "三大練習區",
    body_en:
      "Daily for warm-up (Today + Practice). Learn for skill work (Coaches, Library, Pronunciation Lab). Consolidate for review (Night Review, Progress).",
    body_zh:
      "「每日」做暖身（今日 + 練習）；「學習」做技能訓練（教練、閱讀庫、發音實驗室）；「鞏固」做複習（晚間複習、進度）。",
  },
  {
    icon: "sparkles",
    title_en: "The four-stage Coach ladder",
    title_zh: "四階段教練階梯",
    body_en:
      "Stage 1 is low-pressure chat (no scoring). Stage 4 is full argument deconstruction. Climb when ready — there's no exam unless you ask for one.",
    body_zh:
      "Stage 1 是無評分的輕鬆對話；Stage 4 是論點拆解。準備好就往上爬，沒有人逼你考試。",
  },
];

export function Onboarding({ lang }: { lang: Lang }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (!window.localStorage.getItem(STORAGE_KEY)) setOpen(true);
    } catch {
      /* localStorage may throw in private-mode Safari — fail closed (don't nag) */
    }
  }, []);

  const dismiss = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setOpen(false);
  };

  if (!open) return null;

  const s = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const title = lang === "zh" ? s.title_zh : s.title_en;
  const body = lang === "zh" ? s.body_zh : s.body_en;

  return (
    <div className="modal-backdrop" onClick={dismiss}>
      <div
        className="sheet"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
        style={{ maxWidth: 480 }}
      >
        <div className="sheet-hd row" style={{ justifyContent: "space-between", alignItems: "center" }}>
          <div className="eyebrow">
            {lang === "zh" ? "歡迎使用" : "Welcome"} · {step + 1} / {STEPS.length}
          </div>
          <button
            className="btn-ghost"
            onClick={dismiss}
            aria-label={lang === "zh" ? "略過介紹" : "Skip intro"}
            style={{ width: 44, height: 44, display: "inline-flex", alignItems: "center", justifyContent: "center" }}
          >
            <Icon name="x" size={18} />
          </button>
        </div>
        <div className="sheet-body">
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "color-mix(in oklch, var(--accent) 12%, var(--surface))",
              color: "var(--accent-ink)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 14,
            }}
          >
            <Icon name={s.icon} size={26} stroke={1.75} />
          </div>
          <h3
            id="onboarding-title"
            className="serif"
            style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 600 }}
          >
            {title}
          </h3>
          <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.65, color: "var(--ink-2)" }}>{body}</p>

          <div
            className="row"
            style={{ marginTop: 22, justifyContent: "space-between", alignItems: "center" }}
          >
            <div className="row gap-2">
              {STEPS.map((_, i) => (
                <span
                  key={i}
                  aria-hidden="true"
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: i === step ? "var(--accent)" : "var(--border-strong)",
                  }}
                />
              ))}
            </div>
            <div className="row gap-2">
              {step > 0 && (
                <button
                  className="btn btn-outline"
                  onClick={() => setStep(step - 1)}
                  style={{ padding: "9px 14px", minHeight: 44 }}
                >
                  {lang === "zh" ? "上一步" : "Back"}
                </button>
              )}
              <button
                className="btn btn-primary"
                onClick={() => (isLast ? dismiss() : setStep(step + 1))}
                style={{ padding: "9px 18px", minHeight: 44 }}
              >
                {isLast ? (lang === "zh" ? "開始練習" : "Get started") : lang === "zh" ? "下一步" : "Next"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
