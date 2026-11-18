"use server";
import { headers } from "next/headers";
import Anthropic from "@anthropic-ai/sdk";
import { assistantRules, knowledge } from "../lib/knowledge";

export type AssistantTurn = { role: "user" | "assistant"; content: string };
export type AssistantReply = { ok: true; text: string } | { ok: false; reason: "unavailable" | "busy" | "invalid" };

const MAX_QUESTIONS = 4, MAX_CHARS = 500, MAX_HISTORY_CHARS = 2000;
const WINDOW_MS = 10 * 60_000, MAX_PER_WINDOW = 12, MAX_PER_DAY = 1500, MAX_TRACKED = 5000;
// Best-effort, per server instance: blunts a runaway tab or a simple script. A shared store (for example Upstash)
// is the upgrade if the assistant is ever abused at scale.
const recent = new Map<string, number[]>();
let dayStart = Date.now(), dayCount = 0;

function allowed(key: string) {
  const now = Date.now();
  if (now - dayStart > 24 * 60 * 60_000) { dayStart = now; dayCount = 0; }
  if (dayCount >= MAX_PER_DAY) return false;               // global budget: caps total spend per instance per day
  const hits = (recent.get(key) ?? []).filter(time => now - time < WINDOW_MS);
  if (hits.length >= MAX_PER_WINDOW) { recent.set(key, hits); return false; }
  hits.push(now); recent.set(key, hits); dayCount++;
  if (recent.size > MAX_TRACKED) {                          // evict the oldest keys (Map keeps insertion order)
    for (const old of recent.keys()) { recent.delete(old); if (recent.size <= MAX_TRACKED * 0.9) break; }
  }
  return true;
}

/** The client address the platform vouches for: x-real-ip, else the rightmost X-Forwarded-For hop (the one the
    edge appended). The leftmost entry is client-supplied and can be spoofed. */
async function clientKey(): Promise<string> {
  const h = await headers();
  const real = h.get("x-real-ip")?.trim();
  if (real) return real;
  const chain = (h.get("x-forwarded-for") ?? "").split(",").map(v => v.trim()).filter(Boolean);
  return chain.length ? chain[chain.length - 1] : "unknown";
}

/** Answers one visitor question from the published facts. The key stays on the server; with no key configured the
    widget shows its hand-off links instead of an answer. */
export async function askAnvaya(history: AssistantTurn[]): Promise<AssistantReply> {
  if (!process.env.ANTHROPIC_API_KEY) return { ok: false, reason: "unavailable" };
  if (!Array.isArray(history) || !history.length) return { ok: false, reason: "invalid" };
  // Only the visitor's own questions are used. Assistant turns sent by the browser can be forged, so they are never
  // replayed to the model; the last few questions are passed as context inside one user message.
  const questions = history
    .filter(turn => turn?.role === "user" && typeof turn.content === "string" && turn.content.trim())
    .map(turn => turn.content.trim().slice(0, MAX_CHARS))
    .slice(-MAX_QUESTIONS);
  if (!questions.length) return { ok: false, reason: "invalid" };
  const current = questions[questions.length - 1];
  const earlier = questions.slice(0, -1).join("\n").slice(-MAX_HISTORY_CHARS);
  const userMessage = earlier
    ? `Earlier questions from this visitor, oldest first (for context only):\n${earlier}\n\nCurrent question:\n${current}`
    : current;
  if (!(await clientKey().then(allowed))) return { ok: false, reason: "busy" };

  try {
    const client = new Anthropic();
    const response = await client.beta.messages.create({
      model: process.env.ANVAYA_ASSISTANT_MODEL || "claude-opus-5-5",
      max_tokens: 1200,
      // Short factual answers: low effort keeps replies quick. Thinking is always on for this model.
      output_config: { effort: "low" },
      // If a safety classifier declines a turn, the API retries it on a fallback model inside the same call.
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: [
        { type: "text", text: assistantRules },
        { type: "text", text: knowledge(), cache_control: { type: "ephemeral" } },
      ],
      messages: [{ role: "user", content: userMessage }],
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
