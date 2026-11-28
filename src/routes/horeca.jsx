import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Service } from "../components/Trade";

export const Route = createFileRoute("/horeca")({
  head: () => ({
    meta: [
      { title: "Horeca | Malnad Coffee House" },
      {
        name: "description",
        content:
          "Consistent roasted coffee beans and filter coffee for caf\u00e9s, hotels and restaurants. Custom roast profiles, reliable supply, MOQ 100 kg. Partner with us.",
      },
    ],
    links: [{ rel: "canonical", href: "https://malnadcoffeehouse.com/horeca" }],
  }),
  component: () => <Service id="horeca" />,
});
