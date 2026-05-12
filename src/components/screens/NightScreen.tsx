"use client";

import type { Lang } from "@/lib/types";
import { L } from "@/lib/i18n";
import { Icon } from "../ui/Icon";
import { LSBadge } from "../ui/Primitives";

const CARDS = [
  { type: "writing" as const, en: "Subject-verb agreement: 'technology HAS been'", zh: "主謂一致：'technology HAS been'" },
  { type: "writing" as const, en: "Article: 'When THE people…' or 'When people…'", zh: "冠詞：'When THE people…' 或 'When people…'" },
  { type: "writing" as const, en: "Cohesion: vary 'on the other hand' → 'Critics, however, counter that…'", zh: "銜接：'on the other hand' → 'Critics, however, counter that…'" },
  { type: "writing" as const, en: "Lexical lift: 'a hot topic' → 'a contentious issue'", zh: "詞彙升級：'a hot topic' → 'a contentious issue'" },
  { type: "writing" as const, en: "Task: Always cite ONE concrete real-world example per body paragraph", zh: "切題：每段本論至少一個具體真實例子" },
  { type: "vocab" as const, en: "infringement (n.) — a violation, esp. of a right or law", zh: "infringement (n.) — 侵犯，尤指權利或法律" },
  { type: "vocab" as const, en: "unwarranted (adj.) — not justified or authorised", zh: "unwarranted (adj.) — 不正當的、不獲授權的" },
  { type: "vocab" as const, en: "discourse (n.) — written or spoken communication on a topic", zh: "discourse (n.) — 對某主題的書面或口頭討論" },
  { type: "pron" as const, en: "/θ/ — 'think' not 'fink'. Bite tongue tip lightly while exhaling.", zh: "/θ/ — 'think' 不是 'fink'。輕咬舌尖呼氣。" },
  { type: "pron" as const, en: "Final cluster: 'estates' — keep the /ts/, don't drop it.", zh: "末端複輔音：'estates' — 保留 /ts/，不要省略。" },
];

export function NightScreen({ lang }: { lang: Lang }) {
  const t = L(lang);
  return (
    <div style={{ padding: "24px 28px 8px" }}>
      <div className="row" style={{ alignItems: "flex-end", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div style={{ maxWidth: 600 }}>
          <div className="eyebrow">{lang === "zh" ? "睡前 10 分鐘鞏固" : "10-minute pre-sleep consolidation"}</div>
          <h2 style={{ margin: "4px 0 6px", fontSize: 24, fontWeight: 600 }}>{t.nightReview}</h2>
          <p style={{ margin: 0, color: "var(--ink-2)", fontSize: 14, lineHeight: 1.55 }}>{t.nightSub}</p>
        </div>
        <div className="row gap-2">
          <LSBadge kind="spaced" lang={lang} />
          <LSBadge kind="consolidate" lang={lang} />
        </div>
      </div>

      <div className="card" style={{ padding: 22 }}>
        <div className="col gap-3">
          {CARDS.map((c, i) => {
            const palette = c.type === "writing" ? "var(--xp)" : c.type === "vocab" ? "var(--accent)" : "var(--good)";
            return (
              <div key={i} className="row gap-3" style={{ alignItems: "flex-start", padding: "10px 12px", border: "1px solid var(--border)", borderRadius: 6 }}>
                <span
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    background: `color-mix(in oklch, ${palette} 14%, var(--surface))`,
                    color: `color-mix(in oklch, ${palette} 60%, var(--ink))`,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon name={c.type === "writing" ? "edit" : c.type === "vocab" ? "book" : "sound"} size={14} />
                </span>
                <span style={{ fontSize: 13.5, color: "var(--ink)", lineHeight: 1.5, flex: 1 }}>{c[lang]}</span>
                <span
                  className="mono"
                  style={{ fontSize: 10, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: ".08em" }}
                >
                  {c.type === "writing" ? (lang === "zh" ? "寫作" : "Writing") : c.type === "vocab" ? (lang === "zh" ? "詞彙" : "Vocab") : (lang === "zh" ? "發音" : "Pron")}
                </span>
              </div>
            );
          })}
        </div>
        <div className="row gap-2" style={{ marginTop: 18, justifyContent: "flex-end" }}>
          <button className="btn btn-outline">
            <Icon name="refresh" size={13} /> {lang === "zh" ? "重新洗牌" : "Reshuffle"}
          </button>
          <button className="btn btn-primary">
            <Icon name="play" size={13} /> {lang === "zh" ? "開始 10 分鐘" : "Start 10 minutes"}
          </button>
        </div>
      </div>
    </div>
  );
}
