"use client";

import type { Lang, Route } from "@/lib/types";
import { L } from "@/lib/i18n";
import { Icon } from "./ui/Icon";
import { Avatar } from "./ui/Primitives";
import { STUDENT } from "@/lib/seed";

interface TopbarProps {
  lang: Lang;
  setLang: (l: Lang) => void;
  regularity: string;
  level: string;
  route: Route;
  setRoute: (r: Route) => void;
}

const ROUTE_ORDER: Route[] = ["today", "practice", "coaches", "library", "pron", "night", "progress", "teacher", "speaking", "writing"];

export function Topbar({ lang, setLang, regularity, level, route, setRoute }: TopbarProps) {
  const t = L(lang);
  const titles: Record<Route, string> = {
    today: lang === "zh" ? "今日" : "Today",
    practice: lang === "zh" ? "練習" : "Practice",
    coaches: lang === "zh" ? "AI 教練" : "AI Coaches",
    progress: lang === "zh" ? "進度" : "Progress",
    library: lang === "zh" ? "閱讀庫" : "Library",
    night: lang === "zh" ? "晚間複習" : "Night Review",
    pron: lang === "zh" ? "發音實驗室" : "Pronunciation Lab",
    teacher: lang === "zh" ? "班級檢視" : "Class view",
    speaking: lang === "zh" ? "口說練習" : "Speaking practice",
    writing: lang === "zh" ? "寫作教練" : "Writing coach",
  };

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        display: "flex",
        alignItems: "baseline",
        gap: 16,
        padding: "18px 32px 14px",
        background: "var(--bg)",
        borderBottom: "2px solid var(--ink)",
        boxShadow: "inset 0 -6px 0 -5px var(--ink)",
        flexWrap: "wrap",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
        <span
          className="mono"
          style={{
            fontSize: 10.5,
            color: "var(--ink-3)",
            letterSpacing: ".16em",
            textTransform: "uppercase",
            alignSelf: "center",
            borderRight: "1px solid var(--border-strong)",
            paddingRight: 12,
            marginRight: 4,
          }}
        >
          § {(ROUTE_ORDER.indexOf(route) + 1).toString().padStart(2, "0")}
        </span>
        <h1 className="serif" style={{ margin: 0, fontSize: 26, fontWeight: 500, letterSpacing: "-0.015em", lineHeight: 1 }}>
          {titles[route] || titles.today}
        </h1>
        {(route === "speaking" || route === "writing") && (
          <button
            className="btn btn-ghost"
            style={{ padding: "4px 8px", fontSize: 12, color: "var(--ink-3)" }}
            onClick={() => setRoute("practice")}
          >
            <Icon name="arrowL" size={14} /> {lang === "zh" ? "返回" : "Back"}
          </button>
        )}
      </div>

      <div
        className="topbar-mobile-hide"
        style={{ flex: 1, maxWidth: 360, position: "relative", marginLeft: 20, alignSelf: "center" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "5px 10px",
            background: "transparent",
            borderBottom: "1px solid var(--border-strong)",
          }}
        >
          <Icon name="search" size={14} stroke={1.5} />
          <span style={{ fontSize: 12.5, color: "var(--ink-3)", flex: 1, fontStyle: "italic" }} className="serif">
            {t.search}
          </span>
          <span className="mono" style={{ fontSize: 10, color: "var(--ink-3)" }}>
            {t.cmd}
          </span>
        </div>
      </div>

      <div
        className="row gap-2 topbar-mobile-hide"
        title={t.regularity}
        style={{ alignSelf: "center", color: "var(--ink-2)", paddingRight: 14, borderRight: "1px solid var(--border)" }}
      >
        <span
          className="mono"
          style={{ fontSize: 10, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: ".12em" }}
        >
          {t.regularity}
        </span>
        <span className="serif" style={{ fontSize: 17, fontWeight: 600, lineHeight: 1 }}>
          {regularity}
        </span>
      </div>

      <div
        className="row gap-2 topbar-mobile-hide"
        style={{ alignSelf: "center", color: "var(--ink-2)", paddingRight: 14, borderRight: "1px solid var(--border)" }}
      >
        <span
          className="mono"
          style={{ fontSize: 10, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: ".12em" }}
        >
          {t.lvl}
        </span>
        <span className="serif" style={{ fontSize: 14, fontWeight: 500, fontStyle: "italic", color: "var(--accent-ink)" }}>
          {level}
        </span>
      </div>

      <div style={{ display: "inline-flex", alignSelf: "center", border: "1px solid var(--border-strong)" }}>
        {(["en", "zh"] as Lang[]).map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            style={{
              padding: "3px 9px",
              fontSize: 11.5,
              fontWeight: 600,
              letterSpacing: ".04em",
              background: lang === l ? "var(--ink)" : "transparent",
              color: lang === l ? "var(--bg)" : "var(--ink-3)",
              borderLeft: l === "zh" ? "1px solid var(--border-strong)" : "none",
            }}
          >
            {l === "en" ? "EN" : "繁"}
          </button>
        ))}
      </div>

      <Avatar initials={STUDENT.initials} hue={STUDENT.hueAvatar} size={32} />
    </header>
  );
}
