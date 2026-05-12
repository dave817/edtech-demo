"use client";

import { Fragment } from "react";
import type { Lang } from "@/lib/types";
import { L } from "@/lib/i18n";
import { Icon } from "../ui/Icon";
import { Avatar } from "../ui/Primitives";
import { CLASS_STUDENTS, CLASS_AVG_BAND } from "@/lib/seed";

const WEAK_LABEL: Record<string, { en: string; zh: string; hue: number }> = {
  fluency: { en: "Fluency", zh: "流暢度", hue: 28 },
  lexical: { en: "Lexical", zh: "詞彙", hue: 180 },
  grammar: { en: "Grammar", zh: "文法", hue: 0 },
  pronunciation: { en: "Pronunciation", zh: "發音", hue: 295 },
  task: { en: "Task response", zh: "切題", hue: 65 },
};

export function TeacherScreen({ lang }: { lang: Lang }) {
  const t = L(lang);
  const activeWeek = CLASS_STUDENTS.filter((s) => s.lastActive !== "3 days ago" && s.lastActive !== "2 days ago").length;

  return (
    <div style={{ padding: "24px 28px 8px" }}>
      <div className="row" style={{ alignItems: "flex-end", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div className="eyebrow">{lang === "zh" ? "5A 班 · 英文" : "Class 5A · English"}</div>
          <h2 style={{ margin: "4px 0 0", fontSize: 24, fontWeight: 600 }}>{t.classRoster}</h2>
        </div>
        <div className="row gap-3">
          <div>
            <div className="eyebrow">{t.weeklyActive}</div>
            <div className="serif" style={{ fontSize: 22, fontWeight: 600 }}>
              {activeWeek} / {CLASS_STUDENTS.length}
            </div>
          </div>
          <div style={{ width: 1, height: 36, background: "var(--border)" }} />
          <div>
            <div className="eyebrow">{t.avgBand}</div>
            <div className="serif" style={{ fontSize: 22, fontWeight: 600, color: "var(--accent-ink)" }}>
              {CLASS_AVG_BAND}
            </div>
          </div>
        </div>
      </div>

      <div className="split-roster">
        {/* Roster */}
        <div className="card" style={{ padding: 0 }}>
          <div className="row" style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", justifyContent: "space-between" }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>{t.classRoster}</h3>
            <div className="row gap-2">
              <button className="btn btn-outline" style={{ padding: "5px 10px", fontSize: 12 }}>
                <Icon name="bolt" size={12} /> {t.autoAssign}
              </button>
              <button className="btn btn-outline" style={{ padding: "5px 10px", fontSize: 12 }}>
                <Icon name="download" size={12} /> {t.exportData}
              </button>
            </div>
          </div>
          <div>
            {CLASS_STUDENTS.map((s, i) => {
              const w = WEAK_LABEL[s.weakest];
              return (
                <div
                  key={s.id}
                  className="roster-row gap-3"
                  style={{
                    borderTop: i === 0 ? "none" : "1px solid var(--border)",
                  }}
                >
                  <Avatar initials={s.initials} hue={s.hue} size={36} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{s.name}</div>
                    <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 2 }}>
                      {s.form} · {lang === "zh" ? "上線" : "active"} {s.lastActive}
                    </div>
                  </div>
                  <span
                    className="pill"
                    style={{
                      background: `color-mix(in oklch, oklch(0.55 0.13 ${w.hue}) 12%, var(--surface))`,
                      color: `oklch(0.4 0.1 ${w.hue})`,
                    }}
                  >
                    {w[lang]}
                  </span>
                  <div className="roster-band">
                    <div className="row" style={{ justifyContent: "space-between", fontSize: 11, color: "var(--ink-3)", marginBottom: 4 }}>
                      <span>{t.band}</span>
                      <span style={{ fontWeight: 600, color: "var(--ink)" }}>
                        {s.band.toFixed(1)}
                        {s.trend === "up" ? " ↑" : s.trend === "down" ? " ↓" : ""}
                      </span>
                    </div>
                    <div className="bar">
                      <i style={{ width: `${(s.band / 9) * 100}%`, background: "var(--accent)" }} />
                    </div>
                  </div>
                  <button className="btn btn-ghost" title={t.tagAGap}>
                    <Icon name="bolt" size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Heatmap */}
        <div className="card" style={{ padding: 22 }}>
          <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 600 }}>{t.skillHeatmap}</h3>
          <div style={{ display: "grid", gridTemplateColumns: "auto repeat(4, 1fr)", gap: 6, alignItems: "center" }}>
            <span />
            {["F", "L", "G", "P"].map((h) => (
              <span key={h} style={{ fontSize: 10, color: "var(--ink-3)", textAlign: "center", textTransform: "uppercase", letterSpacing: ".06em" }}>
                {h}
              </span>
            ))}
            {CLASS_STUDENTS.slice(0, 6).map((s) => (
              <Fragment key={s.id}>
                <span style={{ fontSize: 11, color: "var(--ink-2)" }}>{s.initials}</span>
                {(["fluency", "lexical", "grammar", "pronunciation"] as const).map((cat, ci) => {
                  const isWeak = s.weakest === cat;
                  const tint = isWeak ? "bad" : (s.id.charCodeAt(0) + ci) % 5 > 2 ? "warn" : "good";
                  return (
                    <div
                      key={s.id + cat}
                      className="hm"
                      style={{
                        background:
                          tint === "bad"
                            ? "color-mix(in oklch, var(--bad) 35%, var(--surface))"
                            : tint === "warn"
                            ? "color-mix(in oklch, var(--warn) 25%, var(--surface))"
                            : "color-mix(in oklch, var(--good) 25%, var(--surface))",
                      }}
                    />
                  );
                })}
              </Fragment>
            ))}
          </div>
          <div style={{ marginTop: 18, padding: 12, background: "var(--surface-sunken)", borderRadius: 6 }}>
            <div className="eyebrow" style={{ marginBottom: 6 }}>
              {lang === "zh" ? "教學循環" : "Teaching loop"}
            </div>
            <div className="row gap-2" style={{ fontSize: 12, color: "var(--ink-2)", flexWrap: "wrap" }}>
              <span>1. {t.diagnose}</span>
              <span>→</span>
              <span>2. {t.train}</span>
              <span>→</span>
              <span>3. {t.review}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
