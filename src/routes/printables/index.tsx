import { createFileRoute } from "@tanstack/react-router";
import { PrintableIndex } from "@/components/printables";

export const Route = createFileRoute("/printables/")({
  component: PrintableIndex,
});
