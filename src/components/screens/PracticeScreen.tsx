"use client";

import type { Lang, Route } from "@/lib/types";
import { L } from "@/lib/i18n";
import { Icon } from "../ui/Icon";
import { PRACTICE_CARDS } from "@/lib/seed";

export function PracticeScreen({ lang, setRoute }: { lang: Lang; setRoute: (r: Route) => void }) {
  const t = L(lang);
  return (
    <div style={{ padding: "24px 28px 8px" }}>
      <div style={{ marginBottom: 24 }}>
        <div className="eyebrow">{lang === "zh" ? "今日可選練習" : "Today's drill options"}</div>
        <h2 style={{ margin: "4px 0 0", fontSize: 24, fontWeight: 600, letterSpacing: "-0.01em" }}>
          {t.nav.practice}
        </h2>
        <p style={{ margin: "6px 0 0", color: "var(--ink-2)", fontSize: 14, maxWidth: 680 }}>
          {lang === "zh"
            ? "每張卡片標明所需時間與難度。標有「即將推出」的卡片屬下階段功能。"
            : "Each card shows duration and difficulty. Cards marked 'Coming soon' are in the next milestone."}
        </p>
      </div>

      <div className="card-grid-practice">
        {PRACTICE_CARDS.map((c) => (
          <button
            key={c.id}
            disabled={!c.live}
            onClick={() => c.live && c.route && setRoute(c.route)}
            className="card lift"
            style={{
              padding: 20,
              textAlign: "left",
              opacity: c.live ? 1 : 0.55,
              cursor: c.live ? "pointer" : "not-allowed",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <div className="row" style={{ alignItems: "center", justifyContent: "space-between" }}>
              <span
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 8,
                  background: "color-mix(in oklch, var(--accent) 12%, var(--surface))",
                  color: "var(--accent-ink)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon name={c.icon} size={18} />
              </span>
              {c.recommended && (
                <span className="pill pill-soft">
                  <Icon name="star" size={10} /> {lang === "zh" ? "推薦" : "Recommended"}
                </span>
              )}
              {!c.live && (
                <span className="pill" style={{ background: "var(--surface-sunken)", color: "var(--ink-3)" }}>
                  <Icon name="lock" size={10} /> {t.comingSoon}
                </span>
              )}
            </div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>{c.title[lang]}</h3>
            <p style={{ margin: 0, fontSize: 13, color: "var(--ink-2)", lineHeight: 1.5 }}>{c.desc[lang]}</p>
            <div className="row gap-2" style={{ alignItems: "center", marginTop: 4 }}>
              <span
                className="mono"
                style={{ fontSize: 11, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: ".08em" }}
              >
                <Icon name="clock" size={11} /> {c.minutes} {t.minutes}
              </span>
              <span style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--border-strong)" }} />
              <span
                className="mono"
                style={{ fontSize: 11, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: ".08em" }}
              >
                {c.level}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
