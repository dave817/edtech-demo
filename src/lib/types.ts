export type Lang = "en" | "zh";

export type Route =
  | "today"
  | "practice"
  | "speaking"
  | "writing"
  | "coaches"
  | "library"
  | "night"
  | "pron"
  | "progress"
  | "teacher";

export type CoachId = "general" | "situational" | "exam" | "argument";

export type SpeakingMode = "free" | "p1" | "p2" | "p2drill" | "p3" | "full";

export type WritingDrillType = "task2" | "opening" | "body";

export type AnnotationType = "grammar" | "lexical" | "cohesion" | "task";

export interface Annotation {
  start: number;
  end: number;
  type: AnnotationType;
  text: string;
  why: string;
  fix?: string;
}

export interface WritingFeedback {
  rubric: {
    taskResponse: number;
    cohesion: number;
    lexical: number;
    grammar: number;
  };
  overallBand: number;
  annotations: Annotation[];
  topAreas: string[];
  encouragement: string;
}

export interface RubricLine {
  key: "fluency" | "lexical" | "grammar" | "pronunciation";
  value: number;
  hue: number;
  conf: "high" | "medium" | "low";
}

export interface TranscriptMessage {
  who: "examiner" | "student";
  text: string;
  time: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface Tweaks {
  accent: "teal" | "coral" | "aubergine";
  lang: Lang;
  dark: boolean;
  navCollapsed: boolean;
  aiProvider: "Claude" | "OpenAI" | "Gemini" | "On-prem Llama";
  region: string;
}
