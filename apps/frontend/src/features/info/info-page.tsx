import { useRef, useState } from "react";
import { ContactGroupList } from "./contacts/contact-group-list";
import { minQueryLength } from "./search/search";
import type { SearchType } from "./search/search";
import { SearchField } from "./search/search-field";
import { SearchResults, SearchSuggestions } from "./search/search-results";
import { TopicList } from "./topics/topic-list";

export function InfoPage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<SearchType>();
  const [focused, setFocused] = useState(false);
  const field = useRef<HTMLInputElement>(null);

  // The search shows while the field is focused or holds a query. Leaving an empty field
  // (tap outside, close the keyboard, the X) brings topics and contacts back.
  const searching = focused || query !== "";
  const typed = query.trim().length >= minQueryLength;

  const search = (value: string) => {
    setQuery(value);
    // An emptied query takes its filter along, so the next search starts from all types.
    if (!value) setType(undefined);
  };
  const pick = (value: string) => {
    search(value);
    // Close the keyboard, so the results can be seen.
    field.current?.blur();
  };

  return (
    <>
      <SearchField
        ref={field}
        value={query}
        active={searching}
        onChange={search}
        onFocusChange={setFocused}
      />

      {!searching ? (
        <>
          <div className="mt-2">
            <TopicList />
          </div>
          <section aria-labelledby="contact-groups" className="mt-4 flex flex-col gap-3">
            <h2 id="contact-groups" className="text-heading">
              Kontakte
            </h2>
            <ContactGroupList />
          </section>
        </>
      ) : typed ? (
        <SearchResults query={query} type={type} onType={setType} />
      ) : (
        <SearchSuggestions onPick={pick} />
      )}
    </>
  );
}
