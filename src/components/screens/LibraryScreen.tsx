"use client";

import type { Lang } from "@/lib/types";
import { L } from "@/lib/i18n";
import { Icon } from "../ui/Icon";
import { LIBRARY_ITEMS } from "@/lib/seed";

export function LibraryScreen({ lang }: { lang: Lang }) {
  const t = L(lang);
  return (
    <div style={{ padding: "24px 28px 8px" }}>
      <div style={{ marginBottom: 20 }}>
        <div className="eyebrow">{lang === "zh" ? "閱讀與聆聽資料庫" : "Reading & listening library"}</div>
        <h2 style={{ margin: "4px 0 0", fontSize: 24, fontWeight: 600 }}>{t.nav.library}</h2>
        <p style={{ margin: "6px 0 0", color: "var(--ink-2)", fontSize: 14, maxWidth: 680 }}>
          {t.crossSkill}.{" "}
          {lang === "zh"
            ? "標有「★」的項目來自你過去的寫作或口說練習。"
            : "Items marked ★ were saved from your past writing or speaking sessions."}
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
        {LIBRARY_ITEMS.map((item) => (
          <div key={item.id} className="card lift" style={{ padding: 16 }}>
            <div className="row" style={{ justifyContent: "space-between", marginBottom: 10 }}>
              <span
                className="pill"
                style={{
                  background:
                    item.kind === "reading"
                      ? "color-mix(in oklch, var(--accent) 10%, var(--surface))"
                      : "color-mix(in oklch, var(--good) 14%, var(--surface))",
                  color:
                    item.kind === "reading" ? "var(--accent-ink)" : "color-mix(in oklch, var(--good) 60%, var(--ink))",
                }}
              >
                <Icon name={item.kind === "reading" ? "book" : "sound"} size={11} />
                {item.kind === "reading" ? (lang === "zh" ? "閱讀" : "Reading") : lang === "zh" ? "聆聽" : "Listening"}
              </span>
              {item.saved && (
                <span style={{ fontSize: 12, color: "var(--accent-ink)" }} title={lang === "zh" ? "已儲存" : "Saved"}>
                  ★
                </span>
              )}
            </div>
            <h3 className="serif" style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 600, lineHeight: 1.3 }}>
              {item.title[lang]}
            </h3>
            <div className="row gap-2" style={{ alignItems: "center" }}>
              <span
                className="mono"
                style={{ fontSize: 10.5, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: ".08em" }}
              >
                {item.tag[lang]}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
