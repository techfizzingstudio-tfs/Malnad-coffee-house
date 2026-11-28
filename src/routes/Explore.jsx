import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Partners } from "../components/Trade";

export const Route = createFileRoute("/Explore")({
  head: () => ({ meta: [{ title: "Partnerships | Malnad Coffee House" }] }),
  component: () => <Partners standalone />,
});
