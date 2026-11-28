import React from "react";
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { MotionConfig } from "motion/react";
import {
  Header,
  Footer,
  Intro,
  SiteLink,
  WhatsAppPill,
} from "../components/Shell";
import { PageMotion } from "../components/PageMotion";
import css from "../style.css?url";
export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Malnad Coffee House" },
      {
        name: "description",
        content:
          "Chikmagalur estate coffee, roasted blends and wholesale partnerships from Malnad Coffee House.",
      },
    ],
    links: [{ rel: "stylesheet", href: css }],
  }),
  shellComponent: ({ children }) => (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <MotionConfig reducedMotion="user">
          <a className="skip" href="#main">
            Skip to content
          </a>
          <Header />
          <main id="main">{children}</main>
          <PageMotion />
          <Footer />
          <WhatsAppPill />
        </MotionConfig>
        <Scripts />
      </body>
    </html>
  ),
  component: Outlet,
  notFoundComponent: () => (
    <section className="wrap">
      <Intro label="404" title="Page not found" />
      <SiteLink href="/">Return home →</SiteLink>
    </section>
  ),
});
