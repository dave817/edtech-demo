"use client";

import { useEffect, useState } from "react";
import type { Tweaks } from "@/lib/types";

const KEY = "lumen-tweaks-v1";

const DEFAULTS: Tweaks = {
  accent: "teal",
  lang: "en",
  dark: false,
  navCollapsed: false,
  aiProvider: "OpenAI",
  region: "Hong Kong (asia-east2)",
};

export function useTweaks(): [Tweaks, <K extends keyof Tweaks>(key: K, value: Tweaks[K]) => void] {
  const [tweaks, setTweaks] = useState<Tweaks>(DEFAULTS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setTweaks({ ...DEFAULTS, ...JSON.parse(raw) });
    } catch {
      /* localStorage not available */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(tweaks));
    } catch {
      /* ignore */
    }
  }, [tweaks, hydrated]);

  const set = <K extends keyof Tweaks>(key: K, value: Tweaks[K]) => {
    setTweaks((t) => ({ ...t, [key]: value }));
  };

  return [tweaks, set];
}
