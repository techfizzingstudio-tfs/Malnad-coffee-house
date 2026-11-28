import React, { useEffect, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  EASE,
  FadeUp,
  HairlineRule,
  Magnetic,
  RevealMask,
  ScrollProgressBar,
} from "./Motion";

export const whatsappUrl = "https://wa.me/918977230767";

export const paths = [
  ["Our coffee", "/product"],
  ["Partnerships", "/Explore"],
  ["Our story", "/about"],
  ["Blogs", "/blog"],
];

export function SiteLink({ href, ...props }) {
  if (href.startsWith("/") && !href.startsWith("//")) {
    return <Link to={href} {...props} />;
  }
  return <a href={href} {...props} />;
}

export function Brand() {
  return (
    <SiteLink className="brand" href="/" aria-label="Malnad Coffee House home">
      <span className="bean" aria-hidden="true" />
      <span>
        Malnad<small>COFFEE HOUSE</small>
      </span>
    </SiteLink>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduced = useReducedMotion();
  const pathname = useLocation({ select: (location) => location.pathname });

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`top ${scrolled ? "scrolled" : ""}`}>
      <Brand />
      <button
        type="button"
        className="menu"
        aria-expanded={open}
        aria-controls="navigation-mobile"
        onClick={() => setOpen((current) => !current)}
      >
        {open ? "Close" : "Menu"} ☰
      </button>
      <nav id="navigation" className="desktop-nav" aria-label="Main navigation">
        {paths.map(([name, url]) => (
          <SiteLink key={url} href={url}>
            {name}
          </SiteLink>
        ))}
        <Magnetic strength={0.14}>
          <SiteLink className="contact-link" href="/contact">
            Get in touch <Arrow />
          </SiteLink>
        </Magnetic>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.nav
            id="navigation-mobile"
            className="mobile-drawer open"
            aria-label="Mobile navigation"
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: reduced ? 0 : 0.24, ease: EASE }}
          >
            {paths.map(([name, url]) => (
              <SiteLink key={url} href={url}>
                {name}
              </SiteLink>
            ))}
            <SiteLink className="contact-link" href="/contact">
              Get in touch <Arrow />
            </SiteLink>
          </motion.nav>
        )}
      </AnimatePresence>
      <ScrollProgressBar />
    </header>
  );
}

export function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

export function WhatsAppPill() {
  return (
    <div className="whatsapp-pill-anchor">
      <Magnetic strength={0.2}>
        <a className="whatsapp-pill" href={whatsappUrl}>
          Chat on WhatsApp <Arrow />
        </a>
      </Magnetic>
    </div>
  );
}

export function Footer() {
  return (
    <footer>
      <FadeUp className="footer-top">
        <Brand />
        <div className="footer-links">
          {[...paths, ["FAQs", "/faqs"], ["Contact", "/contact"]].map(
            ([name, url]) => (
              <SiteLink href={url} key={url}>
                {name}
              </SiteLink>
            ),
          )}
        </div>
      </FadeUp>
      <HairlineRule dark />
      <small>
        A unit of MNZ Ventures Pvt. Ltd. · Chikmagalur, Karnataka · Managed by{" "}
        <a href="https://fizzingstudio.com/">Fizzing Studio</a>
      </small>
    </footer>
  );
}

export function Action({ href, children, secondary = false }) {
  return (
    <Magnetic strength={0.16}>
      <SiteLink
        className={"button " + (secondary ? "secondary" : "")}
        href={href}
      >
        {children}
        <Arrow />
      </SiteLink>
    </Magnetic>
  );
}

export function Intro({ label, title, children, immediate = true }) {
  return (
    <section className="intro">
      <RevealMask immediate={immediate} className="label">
        {label}
      </RevealMask>
      <h1>
        <RevealMask immediate={immediate} delay={0.07} as="span">
          {title}
        </RevealMask>
      </h1>
      {children && (
        <FadeUp immediate={immediate} delay={0.14} y={16}>
          <p>{children}</p>
        </FadeUp>
      )}
    </section>
  );
}
