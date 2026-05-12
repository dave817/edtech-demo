"use client";

import type { Lang, Route } from "@/lib/types";
import { L } from "@/lib/i18n";
import { Icon } from "./ui/Icon";

interface SidebarProps {
  route: Route;
  setRoute: (r: Route) => void;
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  lang: Lang;
}

export function Sidebar({ route, setRoute, collapsed, setCollapsed, lang }: SidebarProps) {
  const t = L(lang);
  const groups: Array<{ label: string; items: Array<{ id: Route; icon: string; label: string }> }> = [
    {
      label: lang === "zh" ? "每日" : "Daily",
      items: [
        { id: "today", icon: "home", label: t.nav.today },
        { id: "practice", icon: "bolt", label: t.nav.practice },
      ],
    },
    {
      label: lang === "zh" ? "學習" : "Learn",
      items: [
        { id: "coaches", icon: "sparkles", label: t.nav.coaches },
        { id: "library", icon: "book", label: t.nav.library },
        { id: "pron", icon: "sound", label: t.nav.pron },
      ],
    },
    {
      label: lang === "zh" ? "鞏固" : "Consolidate",
      items: [
        { id: "night", icon: "moon", label: t.nav.night },
        { id: "progress", icon: "chart", label: t.nav.progress },
      ],
    },
    {
      label: lang === "zh" ? "教師" : "Teacher",
      items: [{ id: "teacher", icon: "users", label: t.nav.teacher }],
    },
  ];

  return (
    <aside
      style={{
        borderRight: "1px solid var(--border)",
        background: "var(--bg-2)",
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: 0,
        height: "100vh",
      }}
    >
      <div
        style={{
          padding: collapsed ? "20px 12px" : "22px 20px 18px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            width: 26,
            height: 26,
            background: "var(--ink)",
            color: "var(--bg)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Newsreader, Georgia, serif",
            fontStyle: "italic",
            fontWeight: 600,
            fontSize: 16,
          }}
        >
          L
        </div>
        {!collapsed && (
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.05 }}>
            <span className="serif" style={{ fontWeight: 500, fontSize: 19, letterSpacing: "-0.012em" }}>
              Lumen<span style={{ fontStyle: "italic", color: "var(--accent-ink)" }}>.</span>
            </span>
            <span
              className="mono"
              style={{
                fontSize: 9.5,
                color: "var(--ink-3)",
                textTransform: "uppercase",
                letterSpacing: ".12em",
                marginTop: 3,
              }}
            >
              {t.appTag}
            </span>
          </div>
        )}
        <button
          className="btn-ghost"
          onClick={() => setCollapsed(!collapsed)}
          style={{
            marginLeft: "auto",
            width: 26,
            height: 26,
            borderRadius: 8,
            color: "var(--ink-3)",
            display: collapsed ? "none" : "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          title="Collapse nav"
        >
          <Icon name="panel" size={16} />
        </button>
      </div>

      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          padding: collapsed ? "4px 8px" : "4px 12px",
          overflowY: "auto",
        }}
      >
        {groups.map((g, gi) => (
          <div key={gi}>
            {!collapsed && (
              <div
                style={{
                  fontSize: 10,
                  color: "var(--ink-4)",
                  textTransform: "uppercase",
                  letterSpacing: ".08em",
                  fontWeight: 600,
                  padding: "6px 12px 2px",
                }}
              >
                {g.label}
              </div>
            )}
            {g.items.map((it) => {
              const active = route === it.id;
              return (
                <button
                  key={it.id}
                  onClick={() => setRoute(it.id)}
                  title={it.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    width: "100%",
                    padding: collapsed ? "10px 10px" : "8px 12px",
                    borderRadius: 0,
                    background: active ? "color-mix(in oklch, var(--accent) 8%, transparent)" : "transparent",
                    color: active ? "var(--accent-ink)" : "var(--ink-2)",
                    fontWeight: active ? 600 : 500,
                    fontSize: 13,
                    justifyContent: collapsed ? "center" : "flex-start",
                    borderLeft: active ? "2px solid var(--accent)" : "2px solid transparent",
                    transition: "background .15s ease",
                  }}
                >
                  <Icon name={it.icon} size={18} stroke={active ? 2 : 1.75} />
                  {!collapsed && <span>{it.label}</span>}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      <div style={{ flex: 1 }} />

      {!collapsed && (
        <div style={{ padding: "12px 14px", borderTop: "1px solid var(--border)" }}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>
            {lang === "zh" ? "示範版本" : "Demo build"}
          </div>
          <div style={{ fontSize: 12, color: "var(--ink-3)", lineHeight: 1.5 }}>
            {lang === "zh" ? "此原型用於與校方委員會作技術示範。" : "A demo prototype for the EdTech committee review."}
          </div>
          <div style={{ marginTop: 10 }}>
            <span className="dse-tag">
              <Icon name="badge" size={12} /> {t.dseReady}
            </span>
          </div>
        </div>
      )}
    </aside>
  );
}
