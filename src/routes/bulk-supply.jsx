import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Service } from "../components/Trade";

export const Route = createFileRoute("/bulk-supply")({
  head: () => ({
    meta: [
      { title: "Bulk Supply | Malnad Coffee House" },
      {
        name: "description",
        content:
          "Bulk coffee supply from Chikmagalur: roasted beans, filter coffee, private label and green coffee. Roasted from 100 kg, volume discounts on larger orders.",
      },
    ],
    links: [
      { rel: "canonical", href: "https://malnadcoffeehouse.com/bulk-supply" },
    ],
  }),
  component: () => <Service id="bulk-supply" />,
});
