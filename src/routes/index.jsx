import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Home } from "../components/Home";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [{ title: "Estate coffee from Chikmagalur | Malnad Coffee House" }],
  }),
  component: () => <Home />,
});
