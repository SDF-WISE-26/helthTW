import { Check } from "lucide-react";
import { cn } from "cn";
import { typeLabel } from "./search";
import type { SearchType } from "./search";

// Filter chips above the results, only the types the results have. One at a time,
// "Alle" is none. Outlined until chosen, the chosen one filled with a check.
export function TypeFilter({
  types,
  value,
  onChange,
}: {
  types: SearchType[];
  value?: SearchType;
  onChange: (type?: SearchType) => void;
}) {
  const options = [
    { type: undefined, label: "Alle" },
    ...types.map((type) => ({ type, label: typeLabel[type] })),
  ];

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
