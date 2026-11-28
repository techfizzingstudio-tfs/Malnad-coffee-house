import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  return createRouter({
    routeTree,
    scrollRestoration: true,
    defaultViewTransition: {
      types: ({ fromLocation, pathChanged }) =>
        fromLocation &&
        pathChanged &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? ["page"]
          : false,
    },
  });
}
