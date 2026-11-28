import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Admin } from "../components/Editorial";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Publishing desk | Malnad Coffee House" }] }),
  component: () => <Admin />,
});
