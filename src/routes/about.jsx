import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Story } from "../components/Trade";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Our story | Malnad Coffee House" },
      {
        name: "description",
        content:
          "Malnad Coffee House, a unit of MNZ Ventures Pvt. Ltd., sources, roasts and supplies Chikmagalur coffee to caf\u00e9s, hotels and brands across India.",
      },
    ],
    links: [{ rel: "canonical", href: "https://malnadcoffeehouse.com/about" }],
  }),
  component: () => <Story />,
});
