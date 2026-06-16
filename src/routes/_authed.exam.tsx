import { createFileRoute } from "@tanstack/react-router";
import Exam from "@/pages/Exam";

export const Route = createFileRoute("/_authed/exam")({
  component: Exam,
});
