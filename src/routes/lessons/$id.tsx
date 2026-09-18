import { createFileRoute } from "@tanstack/react-router";
import { LessonBody, LessonNotFound } from "@/components/lessons-body";
import { LESSONS } from "@/content/unit";

export const Route = createFileRoute("/lessons/$id")({
  component: LessonPage,
});

function LessonPage() {
  const { id } = Route.useParams();
  if (!LESSONS.some((l) => l.id === id)) return <LessonNotFound />;
  return <LessonBody id={id} />;
}
