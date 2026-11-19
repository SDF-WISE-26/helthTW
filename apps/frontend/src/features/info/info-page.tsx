import { ContactList } from "./contact-list";
import { minQueryLength } from "./search";
import type { SearchType } from "./search";
import { SearchField } from "./search-field";
import { SearchResults, SearchSuggestions, TypeBrowse } from "./search-results";
import { TopicList } from "./topic-list";
import { TypeFilter } from "./type-filter";

export type InfoSearch = { q?: string; type?: SearchType };

// /info: search with type filter on top, below it topics and contacts, the results
// of the search or everything of the chosen type.
export function InfoPage({
  search: { q = "", type },
  onSearch,
}: {
  search: InfoSearch;
  onSearch: (next: InfoSearch) => void;
}) {
  const searching = q.trim().length >= minQueryLength;
  const setQuery = (value: string) => onSearch({ q: value || undefined });

  return (
    <>
      <h1 className="text-2xl font-bold">Infomaterial</h1>
      <SearchField value={q} onChange={setQuery} />
      <TypeFilter value={type} onChange={(next) => onSearch({ type: next })} />

      {searching ? (
        <SearchResults query={q} type={type} onSearchAll={() => onSearch({ type: undefined })} />
      ) : (
        <>
          <SearchSuggestions type={type} onPick={setQuery} />
          {type ? (
            <TypeBrowse type={type} />
          ) : (
            <>
              <section aria-labelledby="info-topics" className="mt-2 flex flex-col gap-3">
                <h2 id="info-topics" className="text-heading">
                  Themen
                </h2>
                <TopicList />
              </section>
              <section aria-labelledby="info-contacts" className="mt-8 flex flex-col gap-3">
                <h2 id="info-contacts" className="text-heading">
                  Kontakte
                </h2>
                <ContactList />
              </section>
            </>
          )}
        </>
      )}
    </>
  );
}
