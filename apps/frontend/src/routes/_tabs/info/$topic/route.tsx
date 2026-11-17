import { Outlet, createFileRoute } from "@tanstack/react-router";
import { TopicPage } from "@/features/info/topic-page";

export const Route = createFileRoute("/_tabs/info/$topic")({
  component: Topic,
});

// The topic stays in the background while an item is open as a sheet on top.
function Topic() {
  const { topic } = Route.useParams();
  return (
    <>
      <TopicPage topicId={topic} />
      <Outlet />
    </>
  );
}
