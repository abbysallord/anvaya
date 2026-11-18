import type { AssistantReply, AssistantTurn } from "./actions";

/* Static hosting (GitHub Pages) has no server to call the model. The static build swaps this in for actions.ts, so
   the widget shows its hand-off links instead. */
export async function askAnvaya(_history: AssistantTurn[]): Promise<AssistantReply> {
  void _history;
  return { ok: false, reason: "unavailable" };
}
