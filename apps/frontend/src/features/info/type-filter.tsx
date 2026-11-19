import { Check } from "lucide-react";
import { cn } from "cn";
import { searchTypes, typeLabel } from "./search";
import type { SearchType } from "./search";

const options = [
  { type: undefined, label: "Alle" },
  ...searchTypes.map((type) => ({ type, label: typeLabel[type] })),
];

// Filter chips under the search field, before and while typing. Always all of them in the
// same place, so the row does not jump under the thumb. One at a time, "Alle" is none.
// Outlined until chosen, unlike the filled suggestion chips that start a search.
export function TypeFilter({
  value,
  onChange,
}: {
  value?: SearchType;
  onChange: (type?: SearchType) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Nach Art filtern"
      className="-mx-4 flex shrink-0 gap-2 overflow-x-auto px-4"
    >
      {options.map(({ type, label }) => {
        const selected = type === value;
        return (
          <button
            key={label}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(type)}
            className={cn(
              "inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full px-4 text-small font-medium",
              "transition-transform outline-none focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-[0.97]",
              selected
                ? "bg-primary pl-3 text-primary-foreground"
                : "bg-card text-foreground ring-1 ring-border ring-inset",
            )}
          >
            {selected && <Check aria-hidden="true" className="size-4" />}
            {label}
          </button>
        );
      })}
    </div>
  );
}
