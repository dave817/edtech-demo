"use client";

import type { Lang } from "@/lib/types";
import { L } from "@/lib/i18n";
import { Icon } from "../ui/Icon";
import { HEATMAP_30, BAND_TRAJECTORY, MILESTONES, SKILL_RADAR } from "@/lib/seed";

export function ProgressScreen({ lang }: { lang: Lang }) {
  const t = L(lang);
  const trajMax = 9;
  const w = 540;
  const h = 160;
  const xStep = w / (BAND_TRAJECTORY.length - 1);
  const yFor = (b: number) => h - 20 - ((b - 4) / (trajMax - 4)) * (h - 40);
  const pathD = BAND_TRAJECTORY.map((p, i) => `${i === 0 ? "M" : "L"} ${i * xStep} ${yFor(p.band)}`).join(" ");

  return (
    <div style={{ padding: "24px 28px 8px" }}>
      <div style={{ marginBottom: 20 }}>
        <div className="eyebrow">{lang === "zh" ? "個人進度" : "Your trajectory"}</div>
        <h2 style={{ margin: "4px 0 0", fontSize: 24, fontWeight: 600 }}>{t.nav.progress}</h2>
      </div>

      <div className="split-hero">
        <div className="col gap-4">
          {/* Band trajectory */}
          <div className="card" style={{ padding: 22 }}>
            <div className="row" style={{ justifyContent: "space-between", marginBottom: 14, alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
                {lang === "zh" ? "分數趨勢（過去 7 週）" : "Band trajectory (last 7 weeks)"}
              </h3>
              <span className="pill pill-soft">
                +1.0 {lang === "zh" ? "分" : "band"}
              </span>
            </div>
            <svg width="100%" height={h + 28} viewBox={`0 0 ${w} ${h + 28}`} style={{ overflow: "visible" }}>
              {[5, 6, 7, 8].map((b) => (
                <g key={b}>
                  <line x1={0} y1={yFor(b)} x2={w} y2={yFor(b)} stroke="var(--border)" strokeDasharray="2 4" />
                  <text x={-6} y={yFor(b) + 4} fontSize={10} textAnchor="end" fill="var(--ink-3)">
                    {b}
                  </text>
                </g>
              ))}
              <path d={pathD} stroke="var(--accent)" strokeWidth={2.5} fill="none" />
              {BAND_TRAJECTORY.map((p, i) => (
                <circle key={i} cx={i * xStep} cy={yFor(p.band)} r={4} fill="var(--accent)" />
              ))}
              {BAND_TRAJECTORY.map((p, i) => (
                <text key={"l" + i} x={i * xStep} y={h + 16} fontSize={10} textAnchor="middle" fill="var(--ink-3)">
                  W{p.week}
                </text>
              ))}
            </svg>
          </div>

          {/* 30-day heatmap */}
          <div className="card" style={{ padding: 22 }}>
            <h3 style={{ margin: "0 0 14px", fontSize: 16, fontWeight: 600 }}>
              {lang === "zh" ? "過去 30 天練習強度" : "Practice intensity, last 30 days"}
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(15, 1fr)", gap: 4 }}>
              {HEATMAP_30.map((v, i) => (
                <div
                  key={i}
                  className="hm"
                  title={`Day ${i + 1}: ${v}`}
                  style={{
                    background:
                      v === 0
                        ? "var(--surface-sunken)"
                        : v === 1
                        ? "color-mix(in oklch, var(--accent) 25%, var(--surface-sunken))"
                        : v === 2
                        ? "color-mix(in oklch, var(--accent) 50%, var(--surface-sunken))"
                        : "var(--accent)",
                    color: v >= 2 ? "var(--accent-fg)" : "var(--ink-3)",
                  }}
                >
                  {v > 0 ? v : ""}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col gap-4">
          {/* Milestones */}
          <div className="card" style={{ padding: 22 }}>
            <h3 style={{ margin: "0 0 14px", fontSize: 16, fontWeight: 600 }}>{t.milestones}</h3>
            <div className="col gap-3">
              {MILESTONES.map((m) => (
                <div key={m.id} className="row gap-3" style={{ alignItems: "center" }}>
                  <span
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background: m.done ? "var(--accent)" : "var(--surface-sunken)",
                      border: "1px solid " + (m.done ? "transparent" : "var(--border-strong)"),
                      color: "white",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {m.done ? <Icon name="check" size={12} stroke={3} /> : <Icon name="lock" size={11} />}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, color: m.done ? "var(--ink)" : "var(--ink-3)" }}>{m[lang]}</div>
                    {m.date && <div style={{ fontSize: 11, color: "var(--ink-3)" }}>{m.date}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skill snapshot */}
          <div className="card" style={{ padding: 22 }}>
            <h3 style={{ margin: "0 0 14px", fontSize: 16, fontWeight: 600 }}>{t.skillRadar}</h3>
            <div className="col gap-3">
              {Object.entries(SKILL_RADAR).map(([k, v]) => (
                <div key={k}>
                  <div className="row" style={{ justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 13, color: "var(--ink-2)", textTransform: "capitalize" }}>{t[k as "listening" | "reading" | "writing" | "speaking"]}</span>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{(v as number).toFixed(1)}</span>
                  </div>
                  <div className="bar">
                    <i style={{ width: `${((v as number) / 9) * 100}%`, background: "var(--accent)" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
