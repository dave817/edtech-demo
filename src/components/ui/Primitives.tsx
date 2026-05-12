"use client";

import { useEffect, type ReactNode } from "react";
import type { Lang } from "@/lib/types";
import { L } from "@/lib/i18n";

export function Bar({ pct = 0, color }: { pct?: number; color?: string }) {
  return (
    <div className="bar">
      <i style={{ width: `${Math.max(0, Math.min(100, pct))}%`, background: color || "var(--accent)" }} />
    </div>
  );
}

export function Avatar({ initials, hue = 180, size = 36 }: { initials: string; hue?: number; size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: `oklch(0.92 0.045 ${hue})`,
        color: `oklch(0.32 0.08 ${hue})`,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 600,
        fontSize: size * 0.4,
        letterSpacing: "-0.01em",
        border: "1px solid var(--border)",
      }}
    >
      {initials}
    </div>
  );
}

export function Modal({
  open,
  onClose,
  children,
  maxWidth = 720,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: number;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="sheet" style={{ maxWidth }} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

export function ProgressRing({
  pct = 0,
  size = 116,
  label,
  sublabel,
}: {
  pct?: number;
  size?: number;
  label: string;
  sublabel?: string;
}) {
  return (
    <div
      className="ring"
      style={
        {
          "--p": pct,
          width: size,
          height: size,
        } as React.CSSProperties
      }
    >
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1, color: "var(--ink)" }}>{label}</div>
        {sublabel && <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 4 }}>{sublabel}</div>}
      </div>
    </div>
  );
}

export function SkillRadar({
  data,
  lang = "en",
  size = 220,
}: {
  data: { listening: number; reading: number; writing: number; speaking: number };
  lang?: Lang;
  size?: number;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const R = size * 0.36;
  const max = 9;
  const t = L(lang);
  const axes = [
    { key: "listening" as const, label: t.listening, angle: -Math.PI / 2 },
    { key: "reading" as const, label: t.reading, angle: 0 },
    { key: "writing" as const, label: t.writing, angle: Math.PI / 2 },
    { key: "speaking" as const, label: t.speaking, angle: Math.PI },
  ];
  const pt = (val: number, angle: number): [number, number] => {
    const r = (val / max) * R;
    return [cx + Math.cos(angle) * r, cy + Math.sin(angle) * r];
  };
  const rings = [3, 5, 7, 9];
  const polyPoints = axes.map((a) => pt(data[a.key], a.angle).join(",")).join(" ");
  return (
    <svg width={size} height={size} className="radar-grid">
      {rings.map((r) => (
        <polygon key={r} points={axes.map((a) => pt(r, a.angle).join(",")).join(" ")} />
      ))}
      {axes.map((a) => {
        const [x, y] = pt(max, a.angle);
        return <line key={a.key} x1={cx} y1={cy} x2={x} y2={y} />;
      })}
      <polygon className="radar-data" points={polyPoints} />
      {axes.map((a) => {
        const [x, y] = pt(max + 1.6, a.angle);
        const align: "start" | "middle" | "end" =
          Math.abs(Math.cos(a.angle)) < 0.2 ? "middle" : Math.cos(a.angle) > 0 ? "start" : "end";
        const dy = Math.sin(a.angle) > 0 ? 12 : -2;
        return (
          <text key={"L" + a.key} x={x} y={y + dy} textAnchor={align} className="radar-axis-label">
            {a.label}
          </text>
        );
      })}
    </svg>
  );
}

const LS_META: Record<string, { hue: number }> = {
  recall: { hue: 28 },
  spaced: { hue: 180 },
  interleaved: { hue: 145 },
  layered: { hue: 295 },
  consolidate: { hue: 50 },
  metacog: { hue: 95 },
};

export function LSBadge({
  kind,
  lang = "en",
}: {
  kind: keyof typeof LS_META;
  lang?: Lang;
}) {
  const meta = LS_META[kind];
  if (!meta) return null;
  const lsStr = (L(lang).ls as Record<string, { label: string; tip: string }>)[kind];
  return (
    <span
      title={lsStr?.tip}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "3px 8px",
        borderRadius: 999,
        fontSize: 9.5,
        letterSpacing: ".08em",
        fontWeight: 700,
        background: `color-mix(in oklch, oklch(0.55 0.13 ${meta.hue}) 10%, var(--surface))`,
        color: `oklch(0.38 0.1 ${meta.hue})`,
        border: `1px solid color-mix(in oklch, oklch(0.55 0.13 ${meta.hue}) 22%, var(--border))`,
      }}
    >
      <span style={{ width: 4, height: 4, borderRadius: "50%", background: `oklch(0.55 0.13 ${meta.hue})` }} />
      {(lsStr?.label || kind).toUpperCase()}
    </span>
  );
}
