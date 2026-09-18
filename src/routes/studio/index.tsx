import { createFileRoute } from "@tanstack/react-router";
import { StudioIndex } from "@/components/studio-games";

export const Route = createFileRoute("/studio/")({ component: StudioIndex });
