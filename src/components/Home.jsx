import React, { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { Action, Arrow, SiteLink } from "./Shell";
import { Collection } from "./Collection";
import { Partners } from "./Trade";
import {
  AnimatedCounter,
  EASE,
  FadeUp,
  HairlineRule,
  MarqueeTicker,
  ParallaxImage,
  RevealMask,
  ScrollHighlightHeadline,
  StaggerGroup,
  StaggerItem,
} from "./Motion";

const slideDuration = 5000;

const slides = [
  {
    top: "Estate coffee",
    title: "Rooted in",
    accent: "Malnad.",
    image: "where-coffee-grows03.webp",
    desc: "Estate-grown coffee from the hills of Chikmagalur, sourced and roasted for cafés, retailers and roasters.",
    caption: "Chikmagalur coffee estates",
    feature: {
      tag: "THIS HARVEST · ARABICA",
      name: "Mountain Reserve",
      image: "/img/arabica-coffee-mountain-reserve.jpg",
      notes: "Floral aroma, jaggery sweetness & cocoa finish.",
      href: "/product",
      cta: "Explore range",
    },
  },
  {
    top: "The roastery",
    title: "Crafted by",
    accent: "the roast.",
    image: "coffee-roasting-process.jpeg",
    desc: "Custom profiles and small-batch roasting bring a consistent cup to your counter.",
    caption: "Inside the roasting room",
    feature: {
      tag: "MEDIUM-DARK · HORECA",
      name: "Signature Espresso",
      image: "/img/robusta-coffee-dark-estate-blend.jpg",
      notes: "Dense crema & dark chocolate body for cafés.",
      href: "/product",
      cta: "View roast guide",
    },
  },
  {
    top: "For your café",
    title: "Made for",
    accent: "your cup.",
    image: "chikmagalur-coffee-beans-hero.jfif",
    desc: "Find the espresso blend, filter grind or private label coffee that suits your business.",
    caption: "From the barista’s bench",
    feature: {
      tag: "CUSTOM CHICORY · BULK",
      name: "South Indian Filter",
      image: "/img/south-indian-filter-coffee-powder.jfif",
      notes: "Authentic decoction blends roasted to order.",
      href: "/horeca",
      cta: "Partner with us",
    },
  },
];

const tickerItems = [
  "CHIKMAGALUR · 1,280 M",
  "SHADE-GROWN ARABICA & ROBUSTA",
  "SMALL-BATCH ROASTED TO ORDER",
  "HORECA & CAFÉ SUPPLY",
  "BULK & PRIVATE LABEL",
  "EXPORT-GRADE LOTS",
];

const processSteps = [
  {
    num: "01",
    stage: "SHADE CANOPY",
    title: "Estate Harvest",
    image: "/img/where-coffee-grows03.webp",
    desc: "Hand-picked ripe cherries from high-elevation Chikmagalur estates.",
  },
  {
    num: "02",
    stage: "SORTED LOTS",
    title: "Graded Green",
    image: "/img/wholesale-green-coffee-beans-india.jfif",
    desc: "Cleaned and screened across AAA, AA, PB and specialty export grades.",
  },
  {
    num: "03",
    stage: "SMALL BATCH",
    title: "Profile Roasting",
    image: "/img/r.webp",
    desc: "Custom roast curves developed for sweetness, balance and heavy crema.",
  },
  {
    num: "04",
    stage: "QUALITY BENCH",
    title: "Cupped & Rested",
    image: "/img/coffee-roasting-process.jpeg",
    desc: "Every roast batch is cooled, cupped and verified for zero flavour drift.",
  },
  {
    num: "05",
    stage: "READY TO BREW",
    title: "Into the Cup",
    image: "/img/COFFEE.avif",
    desc: "Delivered fresh for espresso machines, filter decoctions and private labels.",
  },
];

export function Home() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [canRotate, setCanRotate] = useState(false);
  const heroRef = useRef(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const mistY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", "-14%"]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.25]);
  const cardY = useTransform(scrollYProgress, [0, 1], ["0%", "-22%"]);

  useEffect(() => {
    const motionQuery = matchMedia("(prefers-reduced-motion: reduce)");
    const syncRotation = () => {
      setCanRotate(!document.hidden && !motionQuery.matches);
    };
    syncRotation();
    motionQuery.addEventListener("change", syncRotation);
    document.addEventListener("visibilitychange", syncRotation);
    return () => {
      motionQuery.removeEventListener("change", syncRotation);
      document.removeEventListener("visibilitychange", syncRotation);
    };
  }, []);

  useEffect(() => {
    if (!playing || hovered || !canRotate) return;
    const timer = window.setTimeout(() => {
      if (
        document.hidden ||
        matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return;
      }
      setIndex((current) => (current + 1) % slides.length);
    }, slideDuration);
    return () => window.clearTimeout(timer);
  }, [index, playing, hovered, canRotate]);

  const slide = slides[index];

  return (
    <>
      <section
        className="hero"
        ref={heroRef}
        aria-label="Featured coffee"
        onPointerEnter={(event) => {
          if (event.pointerType === "mouse") setHovered(true);
        }}
        onPointerLeave={() => setHovered(false)}
      >
        <motion.div
          className="scenery"
          aria-hidden="true"
          style={reduced ? undefined : { y: bgY, scale: bgScale }}
        >
          {slides.map((s, i) => (
            <motion.img
              className={i === index ? "visible" : ""}
              key={s.image}
              src={"/img/" + s.image}
              alt=""
              loading={i ? "lazy" : "eager"}
              fetchPriority={i ? "low" : "high"}
              initial={false}
              animate={
                reduced
                  ? { opacity: i === index ? 1 : 0 }
                  : {
                      opacity: i === index ? 1 : 0,
                      scale: i === index ? 1 : 1.08,
                    }
              }
              transition={{
                opacity: { duration: 1.0, ease: EASE },
                scale: { duration: 7.2, ease: "easeOut" },
              }}
            />
          ))}
        </motion.div>

        <motion.div
          className="hero-mist"
          aria-hidden="true"
          style={reduced ? undefined : { y: mistY }}
        />
        <div className="shade" />

        <div className="hero-inner">
          <div className="hero-grid">
            <motion.div
              className="hero-copy-wrap"
              style={reduced ? undefined : { y: copyY, opacity: copyOpacity }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  className="hero-copy"
                  id="hero-slide"
                  key={index}
                  initial={reduced ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={reduced ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  onFocus={() => setPlaying(false)}
                  aria-live={playing && canRotate ? "off" : "polite"}
                >
                  <RevealMask immediate className="label hero-label">
                    Chikmagalur · Karnataka, India
                  </RevealMask>
                  <h1>
                    <RevealMask immediate delay={0.05} as="span">
                      {slide.title}
                    </RevealMask>
                    <br />
                    <RevealMask immediate delay={0.12} as="span">
                      <em>{slide.accent}</em>
                    </RevealMask>
                  </h1>
                  <FadeUp immediate delay={0.18} y={18}>
                    <p>{slide.desc}</p>
                  </FadeUp>
                  <FadeUp immediate delay={0.24} y={16}>
                    <div className="actions">
                      <Action href="/product">Explore our coffee</Action>
                      <SiteLink href="/Explore" className="hero-link">
                        Partner with us ↗
                      </SiteLink>
                    </div>
                  </FadeUp>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            <motion.aside
              className="hero-feature-slot"
              style={reduced ? undefined : { y: cardY }}
              aria-label="Featured harvest spotlight"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={slide.feature.name}
                  className="hero-feature-card"
                  initial={reduced ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? undefined : { opacity: 0, y: -12 }}
                  transition={{ duration: 0.52, ease: EASE }}
                >
                  <div className="hero-feature-media">
                    <img
                      src={slide.feature.image}
                      alt={slide.feature.name}
                      loading="eager"
                    />
                  </div>
                  <div className="hero-feature-body">
                    <span className="hero-feature-tag">{slide.feature.tag}</span>
                    <h2>{slide.feature.name}</h2>
                    <p>{slide.feature.notes}</p>
                    <SiteLink
                      href={slide.feature.href}
                      className="hero-feature-cta"
                    >
                      <span>{slide.feature.cta}</span>
                      <Arrow />
                    </SiteLink>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.aside>
          </div>

          <div className="hero-foot">
            <span className="hero-caption">
              <b>0{index + 1}</b> / 0{slides.length} <i /> {slide.caption}
              <span className="hero-timer-track" aria-hidden="true">
                {playing && !hovered && canRotate && !reduced && (
                  <motion.span
                    key={`timer-${index}`}
                    className="hero-timer-bar"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{
                      duration: slideDuration / 1000,
                      ease: "linear",
                    }}
                    style={{ transformOrigin: "left" }}
                  />
                )}
              </span>
            </span>
            <div className="hero-controls">
              <button
                type="button"
                className="hero-playback"
                aria-label={playing ? "Pause slideshow" : "Play slideshow"}
                onClick={() => setPlaying((current) => !current)}
              >
                <span aria-hidden="true">{playing ? "Ⅱ" : "▶"}</span>
              </button>
              {[-1, 1].map((d) => (
                <button
                  key={d}
                  type="button"
                  aria-controls="hero-slide"
                  aria-label={d < 0 ? "Previous slide" : "Next slide"}
                  onClick={() => {
                    setPlaying(false);
                    setIndex(
                      (current) =>
                        (current + d + slides.length) % slides.length,
                    );
                  }}
                >
                  {d < 0 ? "←" : "→"}
                </button>
              ))}
            </div>
          </div>
        </div>
        <MarqueeTicker items={tickerItems} dark />
      </section>

      <section className="wrap estate-band">
        <div className="estate-grid">
          <div className="estate-copy">
            <RevealMask className="label">01 · The estate origin</RevealMask>
            <ScrollHighlightHeadline
              lineOne="Shade-grown first."
              lineTwo="Roasted for craft."
            />
            <FadeUp delay={0.1}>
              <p className="estate-lead">
                Malnad Coffee House brings high-elevation Chikmagalur coffee to
                cafés, hotels, retailers and specialty roasters across India.
                Grown beneath silver oak and pepper canopies, picked at peak
                ripeness and profiled in small batches for consistent daily
                service.
              </p>
            </FadeUp>
            <HairlineRule />
            <div className="estate-stats">
              <div>
                <strong>
                  <AnimatedCounter value={1280} suffix=" m" />
                </strong>
                <span>Western Ghats elevation</span>
              </div>
              <div>
                <strong>
                  <AnimatedCounter value={50} suffix="+" format={false} />
                </strong>
                <span>Café &amp; retail partners</span>
              </div>
              <div>
                <strong>
                  <AnimatedCounter value={100} suffix="%" format={false} />
                </strong>
                <span>Chikmagalur estate origin</span>
              </div>
              <div>
                <strong>
                  <AnimatedCounter value={2024} format={false} />
                </strong>
                <span>Roastery established</span>
              </div>
            </div>
          </div>

          <div className="estate-visual">
            <ParallaxImage
              src="/img/where-coffee-grows03.webp"
              alt="Shade-grown coffee estates across the hills of Chikmagalur"
              variant="arch"
              intensity={14}
            />
            <FadeUp delay={0.15}>
              <p className="estate-caption">
                The slopes of Chikmagalur — shaded Arabica &amp; Robusta, picked
                at peak ripeness.
              </p>
            </FadeUp>
          </div>
        </div>
      </section>

      <section className="wrap process-band">
        <div className="process-head">
          <div>
            <RevealMask className="label process-label">
              02 · Estate to cup
            </RevealMask>
            <h2 className="process-headline">
              <RevealMask as="span">From estate</RevealMask>
              <br />
              <RevealMask delay={0.08} as="span">
                to <em>your cup.</em>
              </RevealMask>
            </h2>
          </div>
          <FadeUp delay={0.14}>
            <p className="process-sub">
              Five disciplined stages from Chikmagalur’s shade canopy to your
              espresso bar or retail shelf.
            </p>
          </FadeUp>
        </div>

        <StaggerGroup className="process-grid" stagger={0.11}>
          {processSteps.map((step) => (
            <StaggerItem as="article" className="process-card" key={step.num}>
              <ParallaxImage
                src={step.image}
                alt={step.title}
                variant="arch-card"
                intensity={8}
              />
              <div className="process-meta">
                <span>{step.num}</span>
                <span>{step.stage}</span>
              </div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      <Collection featured />
      <Partners />
    </>
  );
}
