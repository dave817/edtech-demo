"use client";

import type { Lang, Route } from "@/lib/types";
import { L } from "@/lib/i18n";
import { Icon } from "../ui/Icon";
import { Bar, ProgressRing, SkillRadar, LSBadge } from "../ui/Primitives";
import { STUDENT, SKILL_RADAR, REGULARITY_14, RECENT_FEEDBACK } from "@/lib/seed";

export function TodayScreen({ lang, setRoute }: { lang: Lang; setRoute: (r: Route) => void }) {
  const t = L(lang);
  return (
    <div style={{ padding: "20px 28px 8px" }}>
      {/* Hero */}
      <div className="hero-grad" style={{ padding: "24px 28px", marginBottom: 20 }}>
        <div className="eyebrow" style={{ marginBottom: 6 }}>
          {lang === "zh" ? "第 21 週 · 第 142 天" : "Week 21 · Day 142"}
        </div>
        <h1 className="serif" style={{ margin: "0 0 6px", fontSize: 28, fontWeight: 600 }}>
          {lang === "zh" ? `早安，${STUDENT.shortName.zh}。` : `Good morning, ${STUDENT.shortName.en}.`}
        </h1>
        <p style={{ margin: 0, color: "var(--ink-2)", fontSize: 14.5, lineHeight: 1.6, maxWidth: 720 }}>
          {t.heroLine} {lang === "zh" ? "今日重點：寫作（你最弱的能力）。" : "Today's focus: Writing — your weakest skill on the radar."}
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20 }}>
        {/* Left column */}
        <div className="col gap-4">
          {/* Daily mission */}
          <div className="card" style={{ padding: 22 }}>
            <div className="row" style={{ justifyContent: "space-between", marginBottom: 16, alignItems: "center" }}>
              <div>
                <div className="eyebrow">{t.dailyMission}</div>
                <h2 style={{ margin: "4px 0 0", fontSize: 20, fontWeight: 600 }}>
                  {lang === "zh" ? "今日任務 · 2 / 3 完成" : "2 of 3 tasks complete"}
                </h2>
              </div>
              <ProgressRing pct={67} size={84} label="67%" sublabel={lang === "zh" ? "12 分鐘" : "12 min left"} />
            </div>
            <div className="col gap-3">
              {(t.tasks as readonly string[]).map((task, i) => {
                const done = i < 2;
                const route: Route = i === 0 ? "library" : i === 1 ? "writing" : "speaking";
                return (
                  <button
                    key={i}
                    onClick={() => setRoute(route)}
                    className="lift"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      padding: "12px 14px",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      background: "var(--surface)",
                      textAlign: "left",
                      opacity: done ? 0.65 : 1,
                    }}
                  >
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        background: done ? "var(--good)" : "var(--surface-sunken)",
                        border: "1px solid " + (done ? "transparent" : "var(--border-strong)"),
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {done && <Icon name="check" size={12} stroke={3} />}
                    </div>
                    <span style={{ flex: 1, fontSize: 14, color: done ? "var(--ink-3)" : "var(--ink)", textDecoration: done ? "line-through" : "none" }}>
                      {task}
                    </span>
                    {!done && (
                      <span className="pill pill-soft">
                        <Icon name="bolt" size={11} /> {lang === "zh" ? "繼續" : "Resume"}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recent feedback */}
          <div className="card" style={{ padding: 22 }}>
            <div className="row" style={{ justifyContent: "space-between", marginBottom: 14, alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>{t.recentFeedback}</h3>
              <span className="pill pill-soft">
                <LSBadge kind="metacog" lang={lang} />
              </span>
            </div>
            <div className="col gap-3">
              {RECENT_FEEDBACK.map((f, i) => (
                <button
                  key={i}
                  onClick={() => setRoute(f.link)}
                  className="lift"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 12px",
                    border: "1px solid var(--border)",
                    borderRadius: 6,
                    background: "var(--surface)",
                    textAlign: "left",
                  }}
                >
                  <span
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 8,
                      background: f.skill === "writing" ? "color-mix(in oklch, var(--xp) 18%, var(--surface))" : "color-mix(in oklch, var(--accent) 14%, var(--surface))",
                      color: f.skill === "writing" ? "color-mix(in oklch, var(--xp) 60%, var(--ink))" : "var(--accent-ink)",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon name={f.skill === "writing" ? "edit" : "mic"} size={16} />
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "var(--ink)" }}>{f.title[lang]}</div>
                    <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 2 }}>{f.time}</div>
                  </div>
                  <span className="pill pill-soft">
                    {t.band} {f.band.toFixed(1)}
                  </span>
                  <Icon name="chevron" size={14} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="col gap-4">
          {/* Regularity heatmap */}
          <div className="card" style={{ padding: 22 }}>
            <div className="row" style={{ justifyContent: "space-between", marginBottom: 12, alignItems: "center" }}>
              <div>
                <div className="eyebrow">{t.regularity}</div>
                <h3 style={{ margin: "2px 0 0", fontSize: 24, fontWeight: 700 }}>
                  {STUDENT.regularity}%
                </h3>
              </div>
              <span className="pill pill-flame">
                <Icon name="flame" size={11} /> {STUDENT.longestStreak}d
              </span>
            </div>
            <p style={{ margin: "0 0 12px", fontSize: 12, color: "var(--ink-3)", fontStyle: "italic" }} className="serif">
              {t.regularityCap}
            </p>
            <div className="row gap-2" style={{ flexWrap: "wrap" }}>
              {REGULARITY_14.map((v, i) => (
                <div
                  key={i}
                  title={`Day ${i + 1}`}
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 4,
                    background:
                      v === 1
                        ? "var(--accent)"
                        : v === 0.5
                        ? "color-mix(in oklch, var(--accent) 40%, var(--surface-sunken))"
                        : "var(--surface-sunken)",
                    border: "1px solid var(--border)",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Skill radar */}
          <div className="card" style={{ padding: 22 }}>
            <h3 style={{ margin: "0 0 10px", fontSize: 16, fontWeight: 600 }}>{t.skillRadar}</h3>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <SkillRadar data={SKILL_RADAR} lang={lang} size={220} />
            </div>
            <button
              onClick={() => setRoute("writing")}
              className="btn btn-outline"
              style={{ width: "100%", marginTop: 14, justifyContent: "center" }}
            >
              <Icon name="edit" size={13} /> {lang === "zh" ? "強化寫作" : "Strengthen Writing"}
            </button>
          </div>

          {/* Learning science badges */}
          <div className="card" style={{ padding: 18 }}>
            <div className="eyebrow" style={{ marginBottom: 10 }}>
              {lang === "zh" ? "本週採用的學習科學原理" : "Learning-science principles in use"}
            </div>
            <div className="row gap-2" style={{ flexWrap: "wrap" }}>
              <LSBadge kind="recall" lang={lang} />
              <LSBadge kind="spaced" lang={lang} />
              <LSBadge kind="interleaved" lang={lang} />
              <LSBadge kind="layered" lang={lang} />
              <LSBadge kind="consolidate" lang={lang} />
              <LSBadge kind="metacog" lang={lang} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
