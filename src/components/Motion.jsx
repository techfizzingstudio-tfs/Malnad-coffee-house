import React, { useEffect, useId, useRef, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useLocation } from "@tanstack/react-router";
import Lenis from "lenis";

export const EASE = [0.22, 1, 0.36, 1];

export function SmoothScroll() {
  const pathname = useLocation({ select: (location) => location.pathname });
  const lenisRef = useRef(null);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let rafId = 0;
    let instance = null;

    function setup() {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
      if (instance) {
        instance.destroy();
        instance = null;
        lenisRef.current = null;
      }
      if (preference.matches) return;

      instance = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.35,
      });
      lenisRef.current = instance;

      const raf = (time) => {
        instance?.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
    }

    setup();
    preference.addEventListener("change", setup);
    return () => {
      preference.removeEventListener("change", setup);
      if (rafId) cancelAnimationFrame(rafId);
      if (instance) {
        instance.destroy();
        lenisRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => {
      lenisRef.current?.resize();
    }, 120);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return null;
}

export function ScrollProgressBar() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 32,
    restDelta: 0.001,
  });

  if (reduced) return null;

  return (
    <motion.div
      className="scroll-progress"
      aria-hidden="true"
      style={{ scaleX, transformOrigin: "0% 50%" }}
    />
  );
}

export function RevealMask({
  children,
  delay = 0,
  immediate = false,
  className = "",
  as = "div",
}) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: "some" });
  const shouldShow = immediate || inView;
  const Tag = as;

  if (reduced) {
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Tag ref={ref} className={"reveal-mask " + className}>
      <motion.span
        className="reveal-mask-inner"
        initial={{ y: "105%", opacity: 0.01 }}
        animate={
          shouldShow ? { y: "0%", opacity: 1 } : { y: "105%", opacity: 0.01 }
        }
        transition={{ duration: 0.82, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </Tag>
  );
}

export function FadeUp({
  children,
  delay = 0,
  y = 24,
  immediate = false,
  className = "",
}) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: "some" });
  const shouldShow = immediate || inView;

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={shouldShow ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.72, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export function ScrollHighlightHeadline({
  lineOne,
  lineTwo,
  accent = true,
  className = "",
}) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.88", "start 0.42"],
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    restDelta: 0.001,
  });
  const lineTwoOpacity = useTransform(smooth, [0, 1], [0.22, 1]);
  const lineTwoY = useTransform(smooth, [0, 1], [12, 0]);

  return (
    <div ref={ref} className={"scroll-headline " + className}>
      <h2 className="estate-headline">
        <RevealMask as="span">{lineOne}</RevealMask>
        <br />
        {reduced ? (
          accent ? (
            <em>{lineTwo}</em>
          ) : (
            <span>{lineTwo}</span>
          )
        ) : (
          <motion.span
            className="scroll-headline-accent"
            style={{ opacity: lineTwoOpacity, y: lineTwoY }}
          >
            {accent ? <em>{lineTwo}</em> : lineTwo}
          </motion.span>
        )}
      </h2>
    </div>
  );
}

export function ParallaxImage({
  src,
  alt = "",
  className = "",
  variant = "default",
  intensity = 10,
  loading = "lazy",
  aspect,
  priority = false,
  objectPosition,
}) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 28,
    restDelta: 0.001,
  });

  const y = useTransform(
    smoothProgress,
    [0, 1],
    [`-${intensity}%`, `${intensity}%`],
  );
  const isPortrait = variant === "portrait";
  const minScale = isPortrait ? 1 : 1 + (intensity * 2.2) / 100;
  const maxScale = isPortrait ? 1.05 : minScale + 0.09;
  const scale = useTransform(smoothProgress, [0, 1], [maxScale, minScale]);

  const frameStyle = aspect ? { aspectRatio: aspect } : undefined;
  const imgStyle = objectPosition ? { objectPosition } : undefined;

  return (
    <figure
      ref={ref}
      className={`parallax-frame parallax-${variant} ${className}`.trim()}
      style={frameStyle}
    >
      <motion.div
        className="parallax-curtain"
        initial={
          reduced ? false : { clipPath: "inset(10% 0% 0% 0%)", opacity: 0.6 }
        }
        whileInView={
          reduced ? undefined : { clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }
        }
        viewport={{ once: true, amount: "some" }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <motion.div
          className="parallax-mover"
          style={reduced ? undefined : { y, scale }}
        >
          <img
            src={src}
            alt={alt}
            loading={priority ? "eager" : loading}
            fetchPriority={priority ? "high" : undefined}
            style={imgStyle}
          />
        </motion.div>
      </motion.div>
    </figure>
  );
}

export function StaggerGroup({
  children,
  className = "",
  stagger = 0.09,
  delayChildren = 0.04,
}) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: "some" });

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: stagger,
            delayChildren,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

const staggerItemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, ease: EASE },
  },
};

export function StaggerItem({ children, className = "", as = "div" }) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as] || motion.div;
  const PlainTag = as;

  if (reduced) {
    return <PlainTag className={className}>{children}</PlainTag>;
  }

  return (
    <MotionTag className={className} variants={staggerItemVariants}>
      {children}
    </MotionTag>
  );
}

export function HairlineRule({ className = "", dark = false }) {
  const reduced = useReducedMotion();
  const classes =
    `hairline-rule ${dark ? "hairline-rule-dark" : ""} ${className}`.trim();

  if (reduced) {
    return <div className={classes} aria-hidden="true" />;
  }

  return (
    <motion.div
      className={classes}
      aria-hidden="true"
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.85, ease: EASE }}
      style={{ transformOrigin: "left" }}
    />
  );
}

export function AnimatedCounter({
  value,
  suffix = "",
  prefix = "",
  format = true,
}) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (reduced || !inView) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, value, {
      duration: 1.0,
      ease: EASE,
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
  }, [inView, value, reduced]);

  const formatted = format
    ? new Intl.NumberFormat("en-US").format(display)
    : String(display);

  return (
    <span ref={ref}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

export function AnimatedMeter({ label, value, delay = 0 }) {
  const reduced = useReducedMotion();
  const numeric = Math.max(0, Math.min(100, Number(value) || 0));

  return (
    <div
      className="meter"
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={numeric}
    >
      <span>{label}</span>
      <div className="meter-track">
        {reduced ? (
          <span
            className="meter-fill"
            style={{ transform: `scaleX(${numeric / 100})` }}
          />
        ) : (
          <motion.span
            className="meter-fill"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: numeric / 100 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, delay, ease: EASE }}
            style={{ transformOrigin: "left" }}
          />
        )}
      </div>
      <span className="meter-value">{numeric}%</span>
    </div>
  );
}

export function MarqueeTicker({ items, dark = true }) {
  return (
    <div
      className={`marquee-bar ${dark ? "marquee-dark" : "marquee-light"}`}
      aria-label="Malnad coffee highlights"
    >
      <div className="marquee-track">
        {items.map((item, idx) => (
          <span className="marquee-item" key={`a-${idx}`}>
            {item}
            <i aria-hidden="true" />
          </span>
        ))}
      </div>
      <div className="marquee-track" aria-hidden="true">
        {items.map((item, idx) => (
          <span className="marquee-item" key={`b-${idx}`}>
            {item}
            <i aria-hidden="true" />
          </span>
        ))}
      </div>
    </div>
  );
}

export function Magnetic({ children, strength = 0.18, className = "" }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 220, damping: 18 });
  const y = useSpring(rawY, { stiffness: 220, damping: 18 });

  if (reduced) {
    return <span className={"magnetic-wrap " + className}>{children}</span>;
  }

  return (
    <motion.span
      ref={ref}
      className={"magnetic-wrap " + className}
      style={{ x, y }}
      onPointerMove={(event) => {
        if (event.pointerType !== "mouse" || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const offsetX = (event.clientX - (rect.left + rect.width / 2)) * strength;
        const offsetY = (event.clientY - (rect.top + rect.height / 2)) * strength;
        rawX.set(offsetX);
        rawY.set(offsetY);
      }}
      onPointerLeave={() => {
        rawX.set(0);
        rawY.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}

export function AccordionItem({ question, answer, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const reduced = useReducedMotion();
  const id = useId();
  const panelId = `accordion-panel-${id}`;
  const triggerId = `accordion-trigger-${id}`;

  return (
    <div className={`accordion-item ${open ? "is-open" : ""}`}>
      <button
        id={triggerId}
        type="button"
        className="accordion-trigger"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((current) => !current)}
      >
        <span>{question}</span>
        <span className="accordion-icon" aria-hidden="true">
          +
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={triggerId}
            className="accordion-panel"
            initial={reduced ? { opacity: 1 } : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.36, ease: EASE }}
          >
            <p>{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
