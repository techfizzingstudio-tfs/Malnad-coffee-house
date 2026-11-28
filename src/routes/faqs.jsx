import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { readFaqs } from "../lib/content";
import { Faqs } from "../components/Editorial";
export const Route = createFileRoute("/faqs")({
  loader: () => readFaqs(),
  head: () => ({ meta: [{ title: "FAQs | Malnad Coffee House" }] }),
  component: () => <Faqs {...Route.useLoaderData()} />,
});
