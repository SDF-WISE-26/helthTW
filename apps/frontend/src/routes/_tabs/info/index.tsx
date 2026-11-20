import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ContactList } from "@/features/info/contact-list";
import { minQueryLength } from "@/features/info/search";
import { SearchField } from "@/features/info/search-field";
import { SearchResults, SearchSuggestions } from "@/features/info/search-results";
import { TopicList } from "@/features/info/topic-list";

export const Route = createFileRoute("/_tabs/info/")({
  component: Info,
});

function Info() {
  const [query, setQuery] = useState("");
  const searching = query.trim().length >= minQueryLength;

  return (
    <>
      <h1 className="text-2xl font-bold">Infomaterial</h1>
      <SearchField value={query} onChange={setQuery} />

      {searching ? (
        <SearchResults query={query} />
      ) : (
        <>
          <SearchSuggestions onPick={setQuery} />
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
  );
}
