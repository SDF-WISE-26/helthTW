import { createFileRoute } from "@tanstack/react-router";
import { TopicPage } from "@/features/info/topic-page";

export const Route = createFileRoute("/_tabs/info/$topic")({
  component: Topic,
});

function Topic() {
  const { topic } = Route.useParams();
  return <TopicPage topicId={topic} />;
}
