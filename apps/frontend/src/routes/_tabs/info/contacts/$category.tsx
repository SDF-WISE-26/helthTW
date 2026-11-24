import { createFileRoute } from "@tanstack/react-router";
import { ContactGroupPage } from "@/features/info/contact-group-page";

export const Route = createFileRoute("/_tabs/info/contacts/$category")({
  component: ContactGroup,
});

function ContactGroup() {
  const { category } = Route.useParams();
  return <ContactGroupPage categoryId={category} />;
}
