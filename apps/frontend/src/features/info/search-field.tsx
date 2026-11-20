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
  onFocusChange,
}: {
  value: string;
  onChange: (value: string) => void;
  onFocusChange?: (focused: boolean) => void;
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

  const [focused, setFocused] = useState(false);
  const focus = (next: boolean) => {
    setFocused(next);
    onFocusChange?.(next);
  };

  const change = (next: string) => {
    echoes.current.push(next);
    setDraft(next);
    onChange(next);
  };

  // One step back, like the cancel of a phone's search: clear the text, or with nothing
  // to clear, leave the field.
  const back = () => (draft ? change("") : input.current?.blur());

  return (
    <form
      role="search"
      // Enter closes the keyboard, so the results can be seen.
      onSubmit={(event) => {
        event.preventDefault();
        input.current?.blur();
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
          onFocus={() => focus(true)}
          onBlur={() => focus(false)}
          onKeyDown={(event) => {
            if (event.key !== "Escape") return;
            event.preventDefault();
            back();
          }}
          value={draft}
          onChange={(event) => change(event.target.value)}
          // Our own clear button instead of the browser's, same on every platform.
          className="text-body [&::-webkit-search-cancel-button]:appearance-none"
        />
        {(draft || focused) && (
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              size="icon-sm"
              aria-label={draft ? "Suche leeren" : "Suche schließen"}
              // Keep the focus in the field, so clearing leaves the keyboard open.
              onMouseDown={(event) => event.preventDefault()}
              onClick={back}
            >
              <X aria-hidden="true" className="size-5" />
            </InputGroupButton>
          </InputGroupAddon>
        )}
      </InputGroup>
    </form>
  );
}
