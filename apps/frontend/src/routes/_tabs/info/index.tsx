import { createFileRoute } from "@tanstack/react-router";
import { ContactList } from "@/features/info/contact-list";
import { TopicList } from "@/features/info/topic-list";

export const Route = createFileRoute("/_tabs/info/")({
  component: Info,
});

function Info() {
  return (
    <>
      <h1 className="text-2xl font-bold">Infomaterial</h1>
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
  );
}
