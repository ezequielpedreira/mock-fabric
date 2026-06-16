import { createFileRoute } from "@tanstack/react-router";
import Lab from "@/pages/Lab";

export const Route = createFileRoute("/_authed/lab")({
  component: Lab,
});
