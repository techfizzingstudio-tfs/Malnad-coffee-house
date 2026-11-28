import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Service } from "../components/Trade";

export const Route = createFileRoute("/export")({
  head: () => ({
    meta: [
      { title: "Export | Malnad Coffee House" },
      {
        name: "description",
        content:
          "Export-grade Indian green and roasted coffee from Chikmagalur. Arabica, Robusta, Peaberry and private label coffee for importers and roasters worldwide.",
      },
    ],
    links: [{ rel: "canonical", href: "https://malnadcoffeehouse.com/export" }],
  }),
  component: () => <Service id="export" />,
});
