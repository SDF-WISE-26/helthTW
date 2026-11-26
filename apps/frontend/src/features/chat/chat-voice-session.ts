import { useCallback, useEffect, useRef, useState } from "react";
import { Room, RoomEvent, Track } from "livekit-client";
import type { ConversationMessage } from "@helthtw/shared/chat";
import { api } from "@/api";

export type VoiceState = "idle" | "connecting" | "listening" | "thinking" | "speaking";

export type VoiceTranscript = { id: string; role: "user" | "assistant"; text: string };

const AGENT_STATES = new Set<VoiceState>(["listening", "thinking", "speaking"]);

export function useVoiceSession(onTranscript: (transcript: VoiceTranscript) => void) {
  const [state, setState] = useState<VoiceState>("idle");
  const [error, setError] = useState<string | null>(null);
  const roomRef = useRef<Room | null>(null);
  const onTranscriptRef = useRef(onTranscript);

  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  useEffect(() => () => void roomRef.current?.disconnect(), []);

  const stop = useCallback(() => {
    const room = roomRef.current;
    roomRef.current = null;
    setState("idle");
    void room?.disconnect();
  }, []);

  const start = useCallback(async (history: ConversationMessage[]) => {
    setError(null);
    setState("connecting");
    const room = new Room();
    roomRef.current = room;

    room.on(RoomEvent.TrackSubscribed, (track) => {
      if (track.kind === Track.Kind.Audio) document.body.append(track.attach());
    });
    room.on(RoomEvent.TrackUnsubscribed, (track) => track.detach().forEach((el) => el.remove()));
    room.on(RoomEvent.ParticipantAttributesChanged, (_changed, participant) => {
      const agentState = participant.attributes["lk.agent.state"] as VoiceState | undefined;
      if (agentState && AGENT_STATES.has(agentState)) setState(agentState);
    });
    room.on(RoomEvent.Disconnected, () => {
      if (roomRef.current !== room) return;
      roomRef.current = null;
      setState("idle");
    });

    // One stream per transcript segment: the agent's reply arrives in pieces, the user's
    // transcript as updated full texts. Either way the latest stream holds the current text.
    room.registerTextStreamHandler("lk.transcription", async (reader, { identity }) => {
      const id = reader.info.attributes?.["lk.segment_id"] ?? reader.info.id;
      const role = identity === room.localParticipant.identity ? "user" : "assistant";
      let text = "";
      for await (const chunk of reader) {
        text += chunk;
        if (text.trim()) onTranscriptRef.current({ id, role, text });
      }
    });

    const fail = (message: string) => {
      if (roomRef.current !== room) return; // ended by the user while connecting
      roomRef.current = null;
      setState("idle");
      void room.disconnect();
      setError(message);
    };

    try {
      const res = await api.api.v1.voice.sessions.$post({ json: { messages: history } });
      if (!res.ok) {
        fail(
          (res.status as number) === 503
            ? "Der Sprachmodus ist gerade nicht verfügbar."
            : "Der Sprachmodus konnte nicht gestartet werden.",
        );
        return;
      }
      const { serverUrl, participantToken } = await res.json();
      await room.connect(serverUrl, participantToken);
      await room.localParticipant.setMicrophoneEnabled(true);
    } catch (e) {
      fail(
        e instanceof Error && e.name === "NotAllowedError"
          ? "Bitte erlaube den Zugriff auf das Mikrofon."
          : "Die Verbindung für den Sprachmodus ist fehlgeschlagen.",
      );
    }
  }, []);

  return { state, error, start, stop, clearError: () => setError(null) };
}
