// Seed data for the demo. Centralised so values stay consistent across screens.

export const STUDENT = {
  name: { en: "Chan Wing Yan", zh: "陳穎欣" },
  shortName: { en: "Wing Yan", zh: "穎欣" },
  initials: "WY",
  form: "Form 5",
  school: "Heep Yunn School",
  l1: "Cantonese",
  targetBand: 7.0,
  currentBand: 6.3,
  regularity: 87,
  longestStreak: 23,
  freezeTokens: 2,
  stage: 3,
  hueAvatar: 180,
};

export const SKILL_RADAR = {
  listening: 6.5,
  reading: 7.0,
  writing: 5.5,
  speaking: 6.0,
};

// 14-day regularity: 1 = practised, 0.5 = light, 0 = missed
export const REGULARITY_14: number[] = [1, 1, 0, 1, 1, 1, 0.5, 1, 1, 1, 0, 1, 1, 1];

// 30-day intensity 0–3 for the heatmap on Progress
export const HEATMAP_30: number[] = [
  2, 2, 0, 1, 3, 2, 2, 1, 3, 2, 0, 2, 2, 1, 3,
  2, 1, 0, 2, 2, 3, 1, 2, 2, 0, 3, 2, 1, 2, 3,
];

export const BAND_TRAJECTORY: Array<{ week: number; band: number }> = [
  { week: 1, band: 5.5 },
  { week: 2, band: 5.5 },
  { week: 3, band: 5.75 },
  { week: 4, band: 6.0 },
  { week: 5, band: 6.0 },
  { week: 6, band: 6.25 },
  { week: 7, band: 6.5 },
];

export const MILESTONES: Array<{ id: string; en: string; zh: string; done: boolean; date?: string }> = [
  { id: "first-mock", en: "First Band 7 mock essay", zh: "第一篇 Band 7 模考文", done: true, date: "Apr 12" },
  { id: "100-cards", en: "100 vocab cards reviewed", zh: "已複習 100 張字卡", done: true, date: "Apr 28" },
  { id: "p3-debate", en: "Held own in Part 3 debate", zh: "Part 3 辯論能站穩立場", done: true, date: "May 03" },
  { id: "th-clean", en: "100 /θ/ instances clean", zh: "/θ/ 音 100 次連續正確", done: false },
  { id: "task1-band7", en: "Task 1 report at band 7", zh: "Task 1 報告達 Band 7", done: false },
];

export const RECENT_FEEDBACK: Array<{
  skill: "speaking" | "writing" | "listening" | "reading";
  title: { en: string; zh: string };
  time: { en: string; zh: string };
  band: number;
  link: "speaking" | "writing";
}> = [
  { skill: "writing", title: { en: "Task 2 · Online surveillance & privacy", zh: "Task 2 · 網絡監控與私隱" }, time: { en: "Today · 14:22", zh: "今日 · 14:22" }, band: 6.0, link: "writing" },
  { skill: "speaking", title: { en: "Part 2 · Describe an old person", zh: "Part 2 · 描述一位長者" }, time: { en: "Yesterday · 19:40", zh: "昨日 · 19:40" }, band: 6.0, link: "speaking" },
  { skill: "writing", title: { en: "Opening drill · Education in HK", zh: "開頭段練習 · 香港教育" }, time: { en: "2 days ago", zh: "2 日前" }, band: 6.5, link: "writing" },
];

// Teacher view — class of 8 students. Names are realistic HK names.
export const CLASS_STUDENTS: Array<{
  id: string;
  name: string;
  initials: string;
  form: string;
  band: number;
  lastActive: string;
  trend: "up" | "flat" | "down";
  hue: number;
  weakest: "fluency" | "lexical" | "grammar" | "pronunciation" | "task";
}> = [
  { id: "1", name: "Chan Wing Yan", initials: "WY", form: "5A", band: 6.3, lastActive: "today", trend: "up", hue: 180, weakest: "lexical" },
  { id: "2", name: "Lam Ka Ho", initials: "KH", form: "5A", band: 5.8, lastActive: "today", trend: "up", hue: 28, weakest: "grammar" },
  { id: "3", name: "Wong Tsz Ching", initials: "TC", form: "5A", band: 7.2, lastActive: "yesterday", trend: "flat", hue: 145, weakest: "fluency" },
  { id: "4", name: "Cheung Yuet Yi", initials: "YY", form: "5B", band: 6.8, lastActive: "today", trend: "up", hue: 295, weakest: "pronunciation" },
  { id: "5", name: "Ng Hei Man", initials: "HM", form: "5A", band: 5.5, lastActive: "3 days ago", trend: "down", hue: 65, weakest: "task" },
  { id: "6", name: "Leung Ching Yiu", initials: "CY", form: "5B", band: 6.0, lastActive: "today", trend: "up", hue: 225, weakest: "pronunciation" },
  { id: "7", name: "Yip Ka Yan", initials: "KY", form: "5A", band: 7.5, lastActive: "yesterday", trend: "flat", hue: 110, weakest: "task" },
  { id: "8", name: "Ho Ching Lam", initials: "CL", form: "5B", band: 5.8, lastActive: "2 days ago", trend: "up", hue: 320, weakest: "grammar" },
];

export const CLASS_AVG_BAND = (CLASS_STUDENTS.reduce((s, x) => s + x.band, 0) / CLASS_STUDENTS.length).toFixed(2);

// Library items
export const LIBRARY_ITEMS: Array<{
  id: string;
  title: { en: string; zh: string };
  kind: "reading" | "listening";
  tag: { en: string; zh: string };
  saved?: "from_writing" | "from_speaking";
}> = [
  { id: "1", title: { en: "Climate · IELTS 17 Test 3", zh: "氣候變遷 · IELTS 17 Test 3" }, kind: "reading", tag: { en: "Argument", zh: "論證" } },
  { id: "2", title: { en: "TED-Ed: Bilingual Brains", zh: "TED-Ed：雙語大腦" }, kind: "listening", tag: { en: "Cognition", zh: "認知" } },
  { id: "3", title: { en: "BBC 6 Minute · Privacy Online", zh: "BBC 6 Minute · 線上私隱" }, kind: "listening", tag: { en: "Tech", zh: "科技" }, saved: "from_writing" },
  { id: "4", title: { en: "Cambridge IELTS Reading 16", zh: "Cambridge IELTS Reading 16" }, kind: "reading", tag: { en: "Academic", zh: "學術" } },
  { id: "5", title: { en: "Surveillance metaphors (essay)", zh: "監控相關隱喻（散文）" }, kind: "reading", tag: { en: "Vocab", zh: "詞彙" }, saved: "from_writing" },
  { id: "6", title: { en: "Old age in HK (short doc)", zh: "香港老齡化（短紀錄片）" }, kind: "listening", tag: { en: "Society", zh: "社會" }, saved: "from_speaking" },
  { id: "7", title: { en: "Economist · AI in classrooms", zh: "經濟學人 · 教室裡的 AI" }, kind: "reading", tag: { en: "Education", zh: "教育" } },
  { id: "8", title: { en: "RTHK Talk · Hong Kong food", zh: "香港電台 · 香港飲食" }, kind: "listening", tag: { en: "Culture", zh: "文化" } },
  { id: "9", title: { en: "IELTS Liz · Cohesion devices", zh: "IELTS Liz · 銜接技巧" }, kind: "reading", tag: { en: "Skills", zh: "技巧" } },
  { id: "10", title: { en: "Podcast · Pronunciation drills", zh: "Podcast · 發音練習" }, kind: "listening", tag: { en: "Pron", zh: "發音" } },
  { id: "11", title: { en: "Guardian · Privacy debate", zh: "衛報 · 私隱辯論" }, kind: "reading", tag: { en: "News", zh: "新聞" } },
  { id: "12", title: { en: "NPR · The Future of Work", zh: "NPR · 未來工作" }, kind: "listening", tag: { en: "Society", zh: "社會" } },
];

// Practice cards
export const PRACTICE_CARDS: Array<{
  id: string;
  title: { en: string; zh: string };
  desc: { en: string; zh: string };
  minutes: number;
  level: string;
  icon: string;
  live: boolean;
  route?: "speaking" | "writing";
  recommended?: boolean;
}> = [
  { id: "speaking-p1", title: { en: "Part 1 Drill", zh: "Part 1 練習" }, desc: { en: "20–30s answers, examiner enforces density", zh: "20-30 秒答覆，密度高" }, minutes: 8, level: "B2", icon: "mic", live: true, route: "speaking" },
  { id: "speaking-p2", title: { en: "Part 2 Cue Card", zh: "Part 2 卡片題" }, desc: { en: "1 min prep · 2 min monologue", zh: "1 分鐘準備 · 2 分鐘獨白" }, minutes: 6, level: "B2", icon: "card", live: true, route: "speaking", recommended: true },
  { id: "writing-task2", title: { en: "Task 2 Essay", zh: "Task 2 議論文" }, desc: { en: "40-min opinion essay with AI feedback", zh: "40 分鐘議論文，AI 評改" }, minutes: 40, level: "B2", icon: "edit", live: true, route: "writing", recommended: true },
  { id: "writing-opening", title: { en: "Opening Paragraph", zh: "開頭段練習" }, desc: { en: "Hook · transition · thesis", zh: "切入 · 轉折 · 立論" }, minutes: 8, level: "B1", icon: "book", live: true, route: "writing" },
  { id: "writing-body", title: { en: "Body Paragraph", zh: "本論段練習" }, desc: { en: "Topic sentence → reasoning → evidence", zh: "主題句 → 推理 → 證據" }, minutes: 10, level: "B2", icon: "book", live: true, route: "writing" },
  { id: "writing-task1", title: { en: "Task 1 Report", zh: "Task 1 報告" }, desc: { en: "Chart / map / process description (20 min)", zh: "圖表 / 地圖 / 流程 (20 分鐘)" }, minutes: 20, level: "B2", icon: "chart", live: false },
  { id: "writing-counter", title: { en: "Counter-argument Drill", zh: "反方論證練習" }, desc: { en: "Concession → rebuttal", zh: "讓步 → 反駁" }, minutes: 10, level: "C1", icon: "edit", live: false },
  { id: "writing-full", title: { en: "Full Exam Simulation", zh: "完整模考" }, desc: { en: "Task 1 + Task 2 in one 60-min session", zh: "Task 1 + Task 2 共 60 分鐘" }, minutes: 60, level: "C1", icon: "check", live: false },
];

// Sample essay shown by default on WritingScreen (Sample mode). Maps to design's hardcoded essay.
export const SAMPLE_ESSAY = {
  question: "Some people believe that governments should monitor citizens' online activity to ensure national security, while others argue this is an unacceptable invasion of privacy. Discuss both views and give your own opinion.",
  body: `In recent years, the issue of online surveillance by governments has become a hot topic across the world. While some argue that monitoring is essential for national security, others think it is bad.

On one hand, supporters of online monitoring believe that it can prevent terrorism. By tracking suspicious communications, authorities can identify threats before they materialise. Furthermore, this technology have been used to catch criminals involved in serious offences such as human trafficking.

On the other hand, opponents say constant surveillance erodes the trust between citizens and the state. When peoples know they are being watched, they may self-censor even legal opinions, which damages democratic discourse.`,
};

// Pre-computed annotations for the sample essay (matches the design's 7 inline notes)
import type { Annotation, WritingFeedback } from "./types";

export const SAMPLE_FEEDBACK: WritingFeedback = {
  rubric: { taskResponse: 6.0, cohesion: 6.5, lexical: 5.5, grammar: 6.0 },
  overallBand: 6.0,
  annotations: ((): Annotation[] => {
    const body = SAMPLE_ESSAY.body;
    const find = (s: string, from = 0) => {
      const i = body.indexOf(s, from);
      return { start: i, end: i + s.length, text: body.slice(i, i + s.length) };
    };
    return [
      { ...find("the issue of"), type: "lexical", why: "Wordy throwaway opener. Drop it and start directly: 'online surveillance has become…'." },
      { ...find("a hot topic"), type: "lexical", why: "B1 register. Try 'a contentious issue' or 'a focal point of debate'." },
      { ...find("others think it is bad"), type: "cohesion", why: "The opposing view is summarised too weakly and informally. Rewrite as: 'others contend it constitutes an unwarranted infringement of personal liberty'." },
      { ...find("it can prevent terrorism"), type: "task", why: "Position is fine but needs a concrete example to lift Task Response. Try the 2017 London Bridge attack — investigators used metadata trails to trace the perpetrators." },
      { ...find("Furthermore, this technology have been"), type: "grammar", why: "Subject–verb agreement: 'technology' is singular, so it should be 'has been'.", fix: "Furthermore, this technology has been" },
      { ...find("opponents say"), type: "cohesion", why: "You've repeated the on-one-hand / on-the-other pair. Vary it: 'Critics, however, counter that…'." },
      { ...find("When peoples"), type: "lexical", why: "Missing article + plural -s creep (common Cantonese-L1 slip). Should be: 'When people'.", fix: "When people" },
    ];
  })(),
  topAreas: [
    "Upgrade B1-register vocabulary",
    "Subject-verb agreement (Cantonese-L1 slip)",
    "Add concrete examples to lift Task Response",
  ],
  encouragement: "Your structure (intro → both sides → opinion) is on the right track. Tighten the register and add one concrete real-world example per body paragraph and you're in band 7 territory.",
};
