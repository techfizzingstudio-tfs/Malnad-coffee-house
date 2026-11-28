import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { readPosts } from "../lib/content";
import { Journal } from "../components/Editorial";
export const Route = createFileRoute("/blog/")({
  loader: () => readPosts(),
  head: () => ({ meta: [{ title: "Coffee journal | Malnad Coffee House" }] }),
  component: () => <Journal {...Route.useLoaderData()} />,
});
