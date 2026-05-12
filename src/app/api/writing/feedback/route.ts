import { NextResponse } from "next/server";
import type { WritingDrillType, WritingFeedback } from "@/lib/types";
import { getWritingPrompt } from "@/lib/prompts";
import { getOpenAI, MODELS } from "@/lib/openai";

export const runtime = "nodejs";

interface FeedbackRequest {
  drillType: WritingDrillType;
  prompt: string;
  userResponse: string;
  lang?: "en" | "zh";
}

const FEEDBACK_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["rubric", "overallBand", "annotations", "topAreas", "encouragement"],
  properties: {
    rubric: {
      type: "object",
      additionalProperties: false,
      required: ["taskResponse", "cohesion", "lexical", "grammar"],
      properties: {
        taskResponse: { type: "number" },
        cohesion: { type: "number" },
        lexical: { type: "number" },
        grammar: { type: "number" },
      },
    },
    overallBand: { type: "number" },
    annotations: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["start", "end", "type", "text", "why"],
        properties: {
          start: { type: "integer" },
          end: { type: "integer" },
          type: { type: "string", enum: ["grammar", "lexical", "cohesion", "task"] },
          text: { type: "string" },
          why: { type: "string" },
          fix: { type: "string" },
        },
      },
    },
    topAreas: { type: "array", items: { type: "string" } },
    encouragement: { type: "string" },
  },
};

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "OPENAI_API_KEY is not configured on the server." }, { status: 500 });
  }

  let body: FeedbackRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { drillType, prompt: writingPrompt, userResponse, lang = "en" } = body;
  if (!userResponse || userResponse.length < 30) {
    return NextResponse.json({ error: "Essay too short — write at least 30 characters." }, { status: 400 });
  }

  const systemPrompt = getWritingPrompt(drillType, lang);

  try {
    const openai = getOpenAI();
    const completion = await openai.chat.completions.create({
      model: MODELS.text,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `IELTS ${drillType.toUpperCase()} prompt:\n${writingPrompt || "(see candidate response)"}\n\nCandidate response (${userResponse.length} chars):\n---\n${userResponse}\n---`,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "WritingFeedback",
          strict: true,
          schema: FEEDBACK_SCHEMA,
        },
      },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: "Empty response from model" }, { status: 502 });
    }

    const feedback = JSON.parse(content) as WritingFeedback;

    // Verify annotation offsets land on the right text; drop bad ones
    feedback.annotations = feedback.annotations.filter((a) => {
      if (a.start < 0 || a.end > userResponse.length || a.start >= a.end) return false;
      const actualText = userResponse.slice(a.start, a.end);
      // Allow whitespace tolerance
      return actualText.trim() === a.text.trim();
    });

    return NextResponse.json(feedback);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `Feedback generation error: ${msg}` }, { status: 500 });
  }
}
