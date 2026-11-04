import { useCallback, useRef, useState } from "react";

/**
 * Handles: AudioContext + AnalyserNode, streaming the LLM reply,
 * splitting it into sentences, and playing TTS for each in order.
 *
 * Expects two backend routes:
 *   POST /api/chat  { prompt }  -> streamed plain text
 *   POST /api/tts   { text }    -> audio bytes (mp3/wav)
 */
export function useSpeech() {
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const pending = useRef(0);

  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [speaking, setSpeaking] = useState(false);

  // Must be called from a user gesture (click/submit) the first time
  const init = useCallback(() => {
    if (!ctxRef.current) {
      const ctx = new AudioContext();
      const a = ctx.createAnalyser();
      a.fftSize = 512;
      a.connect(ctx.destination);
      ctxRef.current = ctx;
      analyserRef.current = a;
      setAnalyser(a);
    }
    void ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  const speak = useCallback((text: string) => {
    pending.current++;
    setSpeaking(true);
    const u = new SpeechSynthesisUtterance(text);
    const done = () => {
      if (--pending.current === 0) setSpeaking(false);
    };
    u.onend = done;
    u.onerror = done;
    window.speechSynthesis.speak(u);
  }, []);

  const ask = useCallback(
    async (prompt: string, onText?: (full: string) => void) => {
      init();
      const res = await fetch("/api/v1/avatar_speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();

      let full = "";
      let buf = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        full += chunk;
        buf += chunk;
        onText?.(full);

        // speak each finished sentence as soon as it arrives
        let i: number;
        while ((i = buf.search(/[.!?]\s/)) !== -1) {
          speak(buf.slice(0, i + 1));
          buf = buf.slice(i + 2);
        }
      }
      if (buf.trim()) speak(buf.trim());
    },
    [init, speak],
  );

  return { analyser, speaking, ask };
}
