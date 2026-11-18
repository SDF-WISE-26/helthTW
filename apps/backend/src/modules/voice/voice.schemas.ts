import { conversationMessageSchema } from "@helthtw/shared/chat";
import { z } from "zod";
import { VOICE_HISTORY_MAX_CHARS, VOICE_HISTORY_MAX_MESSAGES } from "./voice.constants";

// One turn of voice history: like text chat, but shorter (see voice.constants.ts).
const voiceHistoryMessageSchema = conversationMessageSchema.extend({
  text: z.string().trim().min(1).max(VOICE_HISTORY_MAX_CHARS),
});

const voiceHistorySchema = z.array(voiceHistoryMessageSchema).max(VOICE_HISTORY_MAX_MESSAGES);

// Optional history, e.g. when a text chat continues by voice. Passed to the agent with the dispatch.
export const voiceSessionRequestSchema = z.object({
  messages: voiceHistorySchema.default([]),
});

// What the agent finds in its job metadata. Parsed again there, the worker trusts no input.
export const voiceJobMetadataSchema = z.object({
  messages: voiceHistorySchema.catch([]),
});

export type VoiceJobMetadata = z.infer<typeof voiceJobMetadataSchema>;
