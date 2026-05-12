import type { ChatMessage, CoachId, Lang } from "@/lib/types";
import { getCoachPrompt } from "@/lib/coachData";
import { getOpenAI, MODELS } from "@/lib/openai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ChatRequest {
  coachId: CoachId;
  lang: Lang;
  messages: ChatMessage[];
}

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return new Response(JSON.stringify({ error: "OPENAI_API_KEY is not configured on the server." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body: ChatRequest;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { coachId, lang, messages } = body;
  const systemPrompt = getCoachPrompt(coachId, lang);

  try {
    const openai = getOpenAI();
    const stream = await openai.chat.completions.create({
      model: MODELS.text,
      stream: true,
      // gpt-5.x reasoning models require max_completion_tokens, not max_tokens.
      // Older models (gpt-4o etc) accept either; we use the future-proof name.
      max_completion_tokens: 800,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta?.content;
            if (delta) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ delta })}\n\n`));
            }
          }
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
          controller.close();
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: msg })}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: `Chat error: ${msg}` }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
