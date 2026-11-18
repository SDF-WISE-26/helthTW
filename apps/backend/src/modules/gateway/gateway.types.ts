import type { ModelMessage } from "ai";

// Where a turn comes from. A guard may judge differently, e.g. a voice reply is spoken right away.
export type Channel = "text" | "voice";

// allow: pass on unchanged. replace: show or say `text` instead and end the turn.
// block: end the turn; the gateway answers with its fallback text.
// `reason` is a stable code for logs and metrics, never content.
export type Verdict =
  | { action: "allow" }
  | { action: "replace"; text: string; reason: string }
  | { action: "block"; reason: string };

export type InputCheck = {
  channel: Channel;
  // Whole conversation, the last message is the new user turn.
  messages: ModelMessage[];
};

export type OutputCheck = {
  channel: Channel;
  messages: ModelMessage[];
  // The next sentence the LLM wants to send, not yet seen by the user.
  sentence: string;
  // Sentences of this reply that already passed.
  replySoFar: string;
};

// A System-One check around the LLM (Jev from TypeSafe AI, a classifier, rules, ...).
// Implementations live in guards/ and are picked by GUARD_PROVIDER.
export interface Guard {
  readonly name: string;
  checkInput(check: InputCheck): Promise<Verdict>;
  checkOutput(check: OutputCheck): Promise<Verdict>;
}
