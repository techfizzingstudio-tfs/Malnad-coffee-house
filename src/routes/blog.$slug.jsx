import React from "react";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { readPost } from "../lib/content";
import { Article } from "../components/Editorial";
export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const result = await readPost({ data: params.slug });
    if (!result.entry && !result.unavailable) throw notFound();
    return result;
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title:
          (loaderData?.entry?.title ||
            (loaderData?.unavailable
              ? "Article temporarily unavailable"
              : "Article not found")) + " | Malnad Coffee House",
      },
      { name: "description", content: loaderData?.entry?.summary },
    ],
  }),
  component: () => {
    const { entry, unavailable } = Route.useLoaderData();
    return <Article post={entry} unavailable={unavailable} />;
  },
});
