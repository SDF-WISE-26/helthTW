import { Search, X } from "lucide-react";
import type { RefObject } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

export function SearchField({
  ref,
  value,
  active,
  onChange,
  onFocusChange,
}: {
  ref: RefObject<HTMLInputElement | null>;
  value: string;
  // Searching (focused or holding a query): shows the X to clear or leave.
  active: boolean;
  onChange: (value: string) => void;
  onFocusChange: (focused: boolean) => void;
}) {
  // One step back, like the cancel of a phone's search: clear the text, or with nothing
  // to clear, leave the field.
  const back = () => (value ? onChange("") : ref.current?.blur());

  return (
    <form
      role="search"
      // Enter closes the keyboard, so the results can be seen.
      onSubmit={(event) => {
        event.preventDefault();
        ref.current?.blur();
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
          ref={ref}
          onFocus={() => onFocusChange(true)}
          onBlur={() => onFocusChange(false)}
          onKeyDown={(event) => {
            if (event.key !== "Escape") return;
            event.preventDefault();
            back();
          }}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          // Our own clear button instead of the browser's, same on every platform.
          className="text-body [&::-webkit-search-cancel-button]:appearance-none"
        />
        {active && (
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              size="icon-sm"
              aria-label={value ? "Suche leeren" : "Suche schließen"}
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
