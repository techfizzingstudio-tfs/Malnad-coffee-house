import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Catalog } from "../components/Collection";

export const Route = createFileRoute("/product")({
  head: () => ({
    meta: [
      { title: "Our coffee | Malnad Coffee House" },
      {
        name: "description",
        content:
          "Explore Malnad's wholesale coffee range: roasted Arabica & Robusta beans, espresso blends, filter coffee and specialty lots. Bulk orders from 100 kg.",
      },
    ],
    links: [
      { rel: "canonical", href: "https://malnadcoffeehouse.com/product" },
    ],
  }),
  component: () => <Catalog />,
});
