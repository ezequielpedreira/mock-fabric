import { createFileRoute } from "@tanstack/react-router";
import AdminQuestions from "@/pages/AdminQuestions";

export const Route = createFileRoute("/_authed/admin")({
  component: AdminQuestions,
});
