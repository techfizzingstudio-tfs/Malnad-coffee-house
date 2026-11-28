import { createFileRoute } from "@tanstack/react-router";
import { POST } from "../server/publish";
export const Route = createFileRoute("/api/publish")({
  server: { handlers: { POST } },
});
