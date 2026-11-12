// The ONLY file that knows about LiveKit. Another framework gets its own file with the
// same shape (see README): connect(session), disconnect(), on(event, callback).
//
// Events:
//   "status"     -> "connecting" | "connected" | "disconnected" | "error: <message>"
//   "transcript" -> { id, role: "user" | "agent", text, final }

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (window.LivekitClient) return resolve();
    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`could not load ${src}`));
    document.head.append(script);
  });
}

export function createTransport({ audioElement }) {
  const listeners = { status: [], transcript: [] };
  const emit = (event, value) => listeners[event].forEach((callback) => callback(value));
  let room;

  return {
    on(event, callback) {
      listeners[event].push(callback);
    },

    async connect(session) {
      emit("status", "connecting");
      await loadScript("/vendor/livekit-client.js");
      const { Room, RoomEvent } = window.LivekitClient;
      room = new Room();

      room.on(RoomEvent.TrackSubscribed, (track) => {
        if (track.kind === "audio") track.attach(audioElement);
      });
      room.on(RoomEvent.Disconnected, () => emit("status", "disconnected"));
      room.registerTextStreamHandler("lk.transcription", async (reader, participant) => {
        const attributes = reader.info.attributes ?? {};
        emit("transcript", {
          id: attributes["lk.segment_id"] ?? reader.info.id,
          role: participant.identity === room.localParticipant.identity ? "user" : "agent",
          text: await reader.readAll(),
          final: attributes["lk.transcription_final"] === "true",
        });
      });

      await room.connect(session.url, session.token);
      await room.localParticipant.setMicrophoneEnabled(true);
      emit("status", "connected");
    },

    async disconnect() {
      await room?.disconnect();
    },
  };
}
