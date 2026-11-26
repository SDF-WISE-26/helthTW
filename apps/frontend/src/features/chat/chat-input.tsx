import { useRef, useState } from "react";
import { ArrowUpIcon, AudioLinesIcon, MicIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import * as React from "react";

type ChatInputProps = {
  onSend: (text: string) => void;
  onVoice: () => void;
  disabled?: boolean;
};

export function ChatInput({ onSend, onVoice, disabled }: ChatInputProps) {
  const [text, setText] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const hasText = text.trim().length > 0;
  const canSend = hasText && !disabled;
  const canDictate = !hasText && !disabled;

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSend) return;
    onSend(text.trim());
    setText("");
  }

  function handleMic() {
    // TODO: speech to text
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <InputGroup>
        <InputGroupTextarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Tippe etwas..."
          className="p-3"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              formRef.current?.requestSubmit();
            }
          }}
        />
        <InputGroupAddon align="block-end">
          <InputGroupButton
            type="button"
            size="icon-sm"
            variant="default"
            className="ml-auto rounded-full"
            disabled={!canDictate}
            onClick={handleMic}
            aria-label="Nachricht diktieren"
          >
            <MicIcon />
          </InputGroupButton>
          {hasText ? (
            <InputGroupButton
              type="submit"
              size="icon-sm"
              variant="default"
              className="rounded-full"
              disabled={!canSend}
              aria-label="Abschicken"
            >
              <ArrowUpIcon />
            </InputGroupButton>
          ) : (
            <InputGroupButton
              type="button"
              size="icon-sm"
              variant="default"
              className="rounded-full bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              disabled={disabled}
              onClick={onVoice}
              aria-label="Sprachmodus starten"
            >
              <AudioLinesIcon />
            </InputGroupButton>
          )}
        </InputGroupAddon>
      </InputGroup>
    </form>
  );
}
