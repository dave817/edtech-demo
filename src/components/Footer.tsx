"use client";

import type { Lang } from "@/lib/types";
import { L } from "@/lib/i18n";
import { Icon } from "./ui/Icon";

interface FooterProps {
  lang: Lang;
  aiProvider?: string;
  region?: string;
}

export function Footer({ lang, aiProvider = "OpenAI", region = "Hong Kong (asia-east2)" }: FooterProps) {
  const t = L(lang);
  return (
    <footer
      style={{
        marginTop: 32,
        padding: "20px 28px",
        borderTop: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        gap: 18,
        flexWrap: "wrap",
        fontSize: 12,
        color: "var(--ink-3)",
      }}
    >
      <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
        <Icon name="book" size={13} />{" "}
        <b style={{ color: "var(--ink-2)", fontWeight: 600 }}>{t.builtOn}</b>
      </span>
      <span style={{ width: 1, height: 12, background: "var(--border)" }} />
      <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
        <Icon name="sparkles" size={13} /> {t.aiConfig}{" "}
        <b style={{ color: "var(--ink-2)", fontWeight: 600 }}>OpenAI · Gemini · Claude</b>{" "}
        <span style={{ color: "var(--ink-3)" }}>
          · {lang === "zh" ? "目前：" : "currently:"} {aiProvider}
        </span>
      </span>
      <span style={{ width: 1, height: 12, background: "var(--border)" }} />
      <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
        <Icon name="shield" size={13} /> {t.dataIn}{" "}
        <b style={{ color: "var(--ink-2)", fontWeight: 600 }}>{region}</b>
      </span>
      <span style={{ flex: 1 }} />
      <span className="dse-tag">
        <Icon name="badge" size={12} /> {t.dseReady}
      </span>
    </footer>
  );
}
