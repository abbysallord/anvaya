"use server";
import { headers } from "next/headers";
import Anthropic from "@anthropic-ai/sdk";
import { assistantRules, knowledge } from "../lib/knowledge";

export type AssistantTurn = { role: "user" | "assistant"; content: string };
export type AssistantReply = { ok: true; text: string } | { ok: false; reason: "unavailable" | "busy" | "invalid" };

const MAX_TURNS = 12, MAX_CHARS = 600, WINDOW_MS = 10 * 60_000, MAX_PER_WINDOW = 12;
// Best-effort, per server instance: enough to blunt a runaway tab or a simple script. A shared store (for example
// Upstash) is the upgrade if the assistant is ever abused.
const recent = new Map<string, number[]>();

function allowed(key: string) {
  const now = Date.now(), hits = (recent.get(key) ?? []).filter(time => now - time < WINDOW_MS);
  if (hits.length >= MAX_PER_WINDOW) { recent.set(key, hits); return false; }
  hits.push(now); recent.set(key, hits);
  if (recent.size > 5000) recent.clear();
  return true;
}

/** Answers one visitor question from the published facts. The key stays on the server; with no key configured the
    widget shows its hand-off links instead of an answer. */
export async function askAnvaya(history: AssistantTurn[]): Promise<AssistantReply> {
  if (!process.env.ANTHROPIC_API_KEY) return { ok: false, reason: "unavailable" };
  if (!Array.isArray(history) || !history.length) return { ok: false, reason: "invalid" };
  const turns = history.slice(-MAX_TURNS).filter(turn => (turn?.role === "user" || turn?.role === "assistant") && typeof turn.content === "string" && turn.content.trim())
    .map(turn => ({ role: turn.role, content: turn.content.trim().slice(0, turn.role === "user" ? MAX_CHARS : 4000) }));
  while (turns.length && turns[0].role !== "user") turns.shift();
  if (!turns.length || turns[turns.length - 1].role !== "user") return { ok: false, reason: "invalid" };
  const forwarded = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!allowed(forwarded)) return { ok: false, reason: "busy" };

  try {
    const client = new Anthropic();
    const response = await client.beta.messages.create({
      model: process.env.ANVAYA_ASSISTANT_MODEL || "claude-opus-5-5",
      max_tokens: 4000,
      // Short factual answers: low effort keeps replies quick. Thinking is always on for this model.
      output_config: { effort: "low" },
      // If a safety classifier declines a turn, the API retries it on a fallback model inside the same call.
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: [
        { type: "text", text: assistantRules },
        { type: "text", text: knowledge(), cache_control: { type: "ephemeral" } },
      ],
      messages: turns,
    });
    if (response.stop_reason === "refusal") return { ok: true, text: "I can only help with questions about Anvaya's work. For anything else, please use the project form and a person will reply." };
    const text = response.content.flatMap(block => block.type === "text" ? [block.text] : []).join("").trim();
    return text ? { ok: true, text } : { ok: false, reason: "unavailable" };
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) return { ok: false, reason: "busy" };
    if (error instanceof Anthropic.AuthenticationError) return { ok: false, reason: "unavailable" };
    if (error instanceof Anthropic.APIError) return { ok: false, reason: error.status && error.status >= 500 ? "busy" : "unavailable" };
    return { ok: false, reason: "unavailable" };
  }
}
