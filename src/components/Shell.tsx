"use client";

import { useEffect, useState } from "react";
import type { Route } from "@/lib/types";
import { L } from "@/lib/i18n";
import { useTweaks } from "@/hooks/useTweaks";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { Footer } from "./Footer";
import { TodayScreen } from "./screens/TodayScreen";
import { PracticeScreen } from "./screens/PracticeScreen";
import { SpeakingScreen } from "./screens/SpeakingScreen";
import { WritingScreen } from "./screens/WritingScreen";
import { CoachesScreen } from "./screens/CoachesScreen";
import { LibraryScreen } from "./screens/LibraryScreen";
import { NightScreen } from "./screens/NightScreen";
import { PronScreen } from "./screens/PronScreen";
import { ProgressScreen } from "./screens/ProgressScreen";
import { TeacherScreen } from "./screens/TeacherScreen";
import { TweaksPanel } from "./TweaksPanel";
import { STUDENT } from "@/lib/seed";

export function Shell() {
  const [tweaks, setTweak] = useTweaks();
  const [route, setRoute] = useState<Route>("today");

  useEffect(() => {
    document.documentElement.setAttribute("data-accent", tweaks.accent);
    document.documentElement.setAttribute("data-theme", tweaks.dark ? "dark" : "light");
  }, [tweaks.accent, tweaks.dark]);

  // Deep link: ?screen=speaking
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const screen = params.get("screen") as Route | null;
      const valid: Route[] = ["today", "practice", "speaking", "writing", "coaches", "library", "night", "pron", "progress", "teacher"];
      if (screen && valid.includes(screen)) setRoute(screen);
    } catch {
      /* ignore */
    }
  }, []);

  const { lang } = tweaks;
  const t = L(lang);
  const stageLabel = lang === "zh" ? `第${STUDENT.stage}階` : `Stage ${STUDENT.stage}`;

  const screens: Record<Route, React.ReactNode> = {
    today: <TodayScreen lang={lang} setRoute={setRoute} />,
    practice: <PracticeScreen lang={lang} setRoute={setRoute} />,
    speaking: <SpeakingScreen lang={lang} />,
    writing: <WritingScreen lang={lang} />,
    coaches: <CoachesScreen lang={lang} setRoute={setRoute} />,
    library: <LibraryScreen lang={lang} />,
    night: <NightScreen lang={lang} />,
    pron: <PronScreen lang={lang} />,
    progress: <ProgressScreen lang={lang} />,
    teacher: <TeacherScreen lang={lang} />,
  };

  return (
    <div className="app" data-nav={tweaks.navCollapsed ? "collapsed" : "expanded"}>
      <Sidebar
        route={route}
        setRoute={setRoute}
        collapsed={tweaks.navCollapsed}
        setCollapsed={(v) => setTweak("navCollapsed", v)}
        lang={lang}
      />
      <main style={{ minWidth: 0 }}>
        <Topbar
          lang={lang}
          setLang={(l) => setTweak("lang", l)}
          regularity={`${STUDENT.regularity}%`}
          level={stageLabel}
          route={route}
          setRoute={setRoute}
        />
        {screens[route]}
        <Footer lang={lang} aiProvider={tweaks.aiProvider} region={tweaks.region} />
      </main>
      <TweaksPanel tweaks={tweaks} setTweak={setTweak} setRoute={setRoute} route={route} />
    </div>
  );
}
