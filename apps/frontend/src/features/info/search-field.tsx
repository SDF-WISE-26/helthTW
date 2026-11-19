import { Search, X } from "lucide-react";
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
          value={value}
          onChange={(event) => onChange(event.target.value)}
          // Our own clear button instead of the browser's, same on every platform.
          className="text-body [&::-webkit-search-cancel-button]:appearance-none"
        />
        {value && (
          <InputGroupAddon align="inline-end">
            <InputGroupButton size="icon-sm" aria-label="Suche leeren" onClick={() => onChange("")}>
              <X aria-hidden="true" className="size-5" />
            </InputGroupButton>
          </InputGroupAddon>
        )}
      </InputGroup>
    </form>
  );
}
