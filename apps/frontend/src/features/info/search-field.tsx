import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

export function SearchField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  // Typing goes into a draft. The value comes back from the URL a tick later, and taking
  // that echo over would put the cursor at the end. Any other value comes from outside
  // (a picked tag, a link to /info, back and forward) and replaces the draft.
  const [draft, setDraft] = useState(value);
  const echoes = useRef<string[]>([]);
  useEffect(() => {
    const echo = echoes.current.indexOf(value);
    if (echo === -1) setDraft(value);
    echoes.current = echo === -1 ? [] : echoes.current.slice(echo + 1);
  }, [value]);

  const change = (next: string) => {
    echoes.current.push(next);
    setDraft(next);
    onChange(next);
  };

  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <InputGroup className="h-tap-min rounded-xl bg-card">
        <InputGroupAddon>
          <Search aria-hidden="true" className="size-5" />
        </InputGroupAddon>
        <InputGroupInput
          type="search"
          enterKeyHint="search"
          autoComplete="off"
          aria-label="Infomaterial und Kontakte durchsuchen"
          placeholder="Themen, Beiträge, Kontakte"
          ref={input}
          value={draft}
          onChange={(event) => change(event.target.value)}
          // Our own clear button instead of the browser's, same on every platform.
          className="text-body [&::-webkit-search-cancel-button]:appearance-none"
        />
        {draft && (
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              size="icon-sm"
              aria-label="Suche leeren"
              onClick={() => {
                change("");
                input.current?.focus();
              }}
            >
              <X aria-hidden="true" className="size-5" />
            </InputGroupButton>
          </InputGroupAddon>
        )}
      </InputGroup>
    </form>
  );
}
