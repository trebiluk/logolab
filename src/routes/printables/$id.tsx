import { createFileRoute } from "@tanstack/react-router";
import { PrintablePage } from "@/components/printables";

export const Route = createFileRoute("/printables/$id")({
  component: Page,
});

function Page() {
  const { id } = Route.useParams();
  return <PrintablePage id={id} />;
}
