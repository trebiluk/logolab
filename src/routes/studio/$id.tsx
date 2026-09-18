import { createFileRoute } from "@tanstack/react-router";
import { StudioGame } from "@/components/studio-games";

export const Route = createFileRoute("/studio/$id")({
  component: StudioPage,
});

function StudioPage() {
  const { id } = Route.useParams();
  return <StudioGame id={id} />;
}
