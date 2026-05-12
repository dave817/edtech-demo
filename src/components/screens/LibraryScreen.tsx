"use client";

import { useState } from "react";
import type { Lang } from "@/lib/types";
import { L } from "@/lib/i18n";
import { Icon } from "../ui/Icon";
import { LIBRARY_ITEMS } from "@/lib/seed";

type LibraryItem = (typeof LIBRARY_ITEMS)[number];

// Demo excerpts — replace with real article content when sources are wired up.
const EXCERPT_EN: Record<string, string> = {
  reading:
    "This is a sample reading excerpt. In a production build, the full article body would be served from a CMS or feed. For now, you can practice IELTS skim-and-scan techniques on the placeholder text and bookmark items that match what you're studying. Saved items appear in the Today screen as a cross-skill bridge.",
  listening:
    "This is a sample listening item. In a production build, audio would stream from the source with synced transcript and pronunciation tips for Cantonese L1 speakers. For now, you can read the title and category as a study prompt. Tap 'Open original' to listen on the source platform.",
};
const EXCERPT_ZH: Record<string, string> = {
  reading:
    "這是閱讀內容的範例摘錄。正式版本會從 CMS 或 RSS 提供完整文章。目前可先以這段文字練習 IELTS 略讀與掃讀技巧，並收藏與你目前學習相關的項目。已儲存的項目會在「今日」頁面以跨技能橋接卡片顯示。",
  listening:
    "這是聆聽項目的範例。正式版本會串流原始音訊，並提供同步字幕與粵語母語者的發音提示。目前可先以標題和分類做為練習切入點，點「開啟原始連結」前往原始平台收聽。",
};

export function LibraryScreen({ lang }: { lang: Lang }) {
  const t = L(lang);
  const [open, setOpen] = useState<LibraryItem | null>(null);

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
      <div className="card-grid-auto">
        {LIBRARY_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setOpen(item)}
            className="card lift"
            aria-label={`Open ${item.title[lang]}`}
            style={{ padding: 16, textAlign: "left", cursor: "pointer", display: "block", width: "100%" }}
          >
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
          </button>
        ))}
      </div>

      {open && <LibrarySheet item={open} lang={lang} onClose={() => setOpen(null)} />}
    </div>
  );
}

function LibrarySheet({
  item,
  lang,
  onClose,
}: {
  item: LibraryItem;
  lang: Lang;
  onClose: () => void;
}) {
  const excerpt = (lang === "zh" ? EXCERPT_ZH : EXCERPT_EN)[item.kind];
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="sheet"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="library-sheet-title"
      >
        <div
          className="sheet-hd row gap-3"
          style={{ alignItems: "center", justifyContent: "space-between" }}
        >
          <div>
            <div className="eyebrow">
              {item.kind === "reading" ? (lang === "zh" ? "閱讀" : "Reading") : lang === "zh" ? "聆聽" : "Listening"}{" "}
              · {item.tag[lang]}
            </div>
            <h3
              id="library-sheet-title"
              className="serif"
              style={{ margin: "4px 0 0", fontSize: 20, fontWeight: 600 }}
            >
              {item.title[lang]}
            </h3>
          </div>
          <button
            className="btn-ghost"
            onClick={onClose}
            aria-label={lang === "zh" ? "關閉" : "Close"}
            style={{ width: 44, height: 44, display: "inline-flex", alignItems: "center", justifyContent: "center" }}
          >
            <Icon name="x" size={18} />
          </button>
        </div>
        <div className="sheet-body">
          <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.65, color: "var(--ink-2)" }}>{excerpt}</p>
          <div className="row gap-2" style={{ marginTop: 18 }}>
            <button
              className="btn btn-primary"
              onClick={onClose}
              style={{ padding: "10px 16px" }}
            >
              {lang === "zh" ? "知道了" : "Got it"}
            </button>
            <span style={{ fontSize: 12, color: "var(--ink-3)", alignSelf: "center" }}>
              {lang === "zh" ? "正式版本將會接入原始來源。" : "Full source integration coming in v2."}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
