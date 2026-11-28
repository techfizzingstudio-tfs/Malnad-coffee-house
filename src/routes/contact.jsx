import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Contact } from "../components/Trade";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact | Malnad Coffee House" },
      {
        name: "description",
        content:
          "Contact Malnad Coffee House for bulk coffee orders, quotes and partnerships. Call +91 89772 30767 or email sales@malnadcoffeehouse.com. Mon\u2013Sat, 9 AM\u20136 PM.",
      },
    ],
    links: [
      { rel: "canonical", href: "https://malnadcoffeehouse.com/contact" },
    ],
  }),
  component: () => <Contact />,
});
