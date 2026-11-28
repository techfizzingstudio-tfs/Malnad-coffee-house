import React, { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import services from "../data/services.json";
import reviews from "../data/reviews.json";
import { Action, Arrow, Intro, whatsappUrl, SiteLink } from "./Shell";
import {
  AccordionItem,
  EASE,
  FadeUp,
  HairlineRule,
  ParallaxImage,
  RevealMask,
  StaggerGroup,
  StaggerItem,
} from "./Motion";

const offers = {
  horeca: [
    "HoReCa",
    "Coffee for cafés, hotels and restaurants serving more than 50 cups a day.",
    "coffee-cup-cafe-partnership.jpg",
  ],
  "bulk-supply": [
    "Bulk supply",
    "Scalable lots for roasters, distributors, retailers and institutional buyers.",
    "coffee-roasting-process.jpeg",
  ],
  export: [
    "Export",
    "Green and roasted Indian coffee, graded and packed for international buyers.",
    "where-coffee-grows03.webp",
  ],
};

export function Partners({ standalone = false }) {
  const [activeOffer, setActiveOffer] = useState("horeca");
  const reduced = useReducedMotion();
  const [previewTitle, , previewImage] = offers[activeOffer];

  return (
    <section className="trade wrap">
      {standalone ? (
        <Intro label="Trade partnerships" title="Work with Malnad">
          Choose the supply programme that fits your business.
        </Intro>
      ) : (
        <div className="sectionhead">
          <div>
            <RevealMask className="label">Trade partnerships</RevealMask>
            <h2>
              <RevealMask delay={0.06} as="span">
                Coffee for your business
              </RevealMask>
            </h2>
          </div>
        </div>
      )}

      <div className="trade-layout">
        <StaggerGroup className="trade-list" stagger={0.09}>
          {Object.entries(offers).map(([key, [title, desc]]) => (
            <StaggerItem key={key} className="trade-row-wrap">
              <HairlineRule />
              <SiteLink
                className={`trade-row ${activeOffer === key ? "is-active" : ""}`}
                href={"/" + key}
                onMouseEnter={() => setActiveOffer(key)}
                onFocus={() => setActiveOffer(key)}
              >
                <h3>{title}</h3>
                <p>{desc}</p>
                <Arrow />
              </SiteLink>
            </StaggerItem>
          ))}
          <HairlineRule />
        </StaggerGroup>

        <aside className="trade-preview" aria-hidden="true">
          <div className="trade-preview-frame">
            {Object.entries(offers).map(([key, [label, , image]]) => {
              const active = activeOffer === key;
              return (
                <motion.img
                  key={key}
                  src={"/img/" + image}
                  alt=""
                  initial={false}
                  animate={
                    reduced
                      ? { opacity: active ? 1 : 0 }
                      : {
                          opacity: active ? 1 : 0,
                          scale: active ? 1 : 1.05,
                        }
                  }
                  transition={{ duration: 0.45, ease: EASE }}
                  style={{ zIndex: active ? 2 : 1 }}
                />
              );
            })}
            <div className="trade-preview-label">{previewTitle}</div>
          </div>
        </aside>
      </div>

      {standalone && (
        <FadeUp delay={0.15}>
          <div className="actions">
            <Action href="https://forms.gle/NxoJqStECT214NNMA">
              General partnership enquiry
            </Action>
          </div>
        </FadeUp>
      )}
    </section>
  );
}

export function Service({ id }) {
  const [title, desc, image] = offers[id],
    { form, cards, steps, faqs } = services[id];
  return (
    <>
      <div className="split">
        <div>
          <Intro label="Trade partnerships" title={title}>
            {desc}
          </Intro>
          <FadeUp immediate delay={0.2}>
            <Action href={form}>Start an enquiry</Action>
          </FadeUp>
        </div>
        <ParallaxImage
          src={"/img/" + image}
          alt={title}
          variant="split"
          intensity={12}
          priority
        />
      </div>
      <div className="wrap">
        <RevealMask className="label">Supply options</RevealMask>
        <h2>
          <RevealMask delay={0.06} as="span">
            Products &amp; specifications
          </RevealMask>
        </h2>
        <StaggerGroup className="grid" stagger={0.09}>
          {cards.map((c) => (
            <StaggerItem as="article" className="spec" key={c.title}>
              <h3>{c.title}</h3>
              <p>{c.description}</p>
              <ul>
                {c.specs.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
              <a className="textlink" href={form}>
                Enquire <Arrow />
              </a>
            </StaggerItem>
          ))}
        </StaggerGroup>
        {steps.length > 0 && (
          <section className="sub">
            <h2>
              <RevealMask as="span">How to get started</RevealMask>
            </h2>
            <StaggerGroup className="steps-list-wrap" stagger={0.08}>
              <ol className="steps-list">
                {steps.map((s, idx) => (
                  <StaggerItem as="li" key={s}>
                    <span className="step-num">0{idx + 1}</span>
                    <span>{s}</span>
                  </StaggerItem>
                ))}
              </ol>
            </StaggerGroup>
          </section>
        )}
        {faqs.length > 0 && (
          <section className="sub">
            <h2>
              <RevealMask as="span">Common questions</RevealMask>
            </h2>
            <div className="accordion-list">
              {faqs.map(([q, a]) => (
                <AccordionItem key={q} question={q} answer={a} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}

export function About() {
  return (
    <>
      <div className="split">
        <div>
          <Intro
            label="Our story · Since 2024"
            title="From the hills of Chikmagalur"
          >
            Malnad Coffee House brings estate-grown coffee to cafés, retailers
            and roasters across India. We source green beans, develop blends and
            roast in small batches.
          </Intro>
          <FadeUp immediate delay={0.2}>
            <Action href="/product">Discover our coffee</Action>
          </FadeUp>
        </div>
        <ParallaxImage
          src="/img/where-coffee-grows03.webp"
          alt="Coffee estate in Chikmagalur"
          variant="split"
          intensity={12}
          priority
        />
      </div>
      <section className="founder wrap">
        <ParallaxImage
          src="/img/m-zaki-founder-malnad-coffee-house.jpeg"
          alt="M. Zaki"
          variant="portrait"
          intensity={4}
          objectPosition="center bottom"
        />
        <div>
          <RevealMask className="label">From the founder</RevealMask>
          <blockquote>
            <RevealMask delay={0.08} as="span">
              “Every batch we produce reflects our passion for quality roasting,
              trusted sourcing and meaningful customer relationships.”
            </RevealMask>
          </blockquote>
          <FadeUp delay={0.18}>
            <p>M. Zaki · Founder &amp; CEO</p>
          </FadeUp>
        </div>
      </section>
    </>
  );
}

export function Contact() {
  return (
    <section className="wrap">
      <Intro label="Enquiries" title="Get in touch">
        Tell us about your café, your next order or the coffee you want to
        create.
      </Intro>
      <HairlineRule />
      <StaggerGroup className="contact-grid" stagger={0.1}>
        <StaggerItem className="contact-card">
          <div className="label">Sales desk</div>
          <p>
            <a href="mailto:sales@malnadcoffeehouse.com">
              sales@malnadcoffeehouse.com
            </a>
          </p>
          <p>
            <a href="tel:+918977230767">+91 89772 30767</a>
          </p>
          <Action href={whatsappUrl}>Message on WhatsApp</Action>
        </StaggerItem>
        <StaggerItem className="contact-card">
          <div className="label">Visit the estate town</div>
          <h3>Chikmagalur, Karnataka</h3>
          <p>
            Monday to Saturday
            <br />
            9:00 AM – 6:00 PM IST
          </p>
          <a
            className="textlink"
            href="https://www.google.com/maps/search/?api=1&query=Malnad+Coffee+House+Chikmagalur"
          >
            Open map <Arrow />
          </a>
        </StaggerItem>
      </StaggerGroup>
    </section>
  );
}

export function Story() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const reduced = useReducedMotion();
  const [quote, name, role] = reviews[index];

  const step = (delta) => {
    setDirection(delta);
    setIndex((current) => (current + delta + reviews.length) % reviews.length);
  };

  return (
    <>
      <About />
      <section className="trade wrap testimonial-band">
        <RevealMask className="label">From our partners</RevealMask>
        <div className="testimonial-stage">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              className="testimonial"
              key={index}
              initial={
                reduced
                  ? false
                  : { opacity: 0, x: direction * 28, filter: "blur(4px)" }
              }
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={
                reduced
                  ? undefined
                  : { opacity: 0, x: direction * -28, filter: "blur(4px)" }
              }
              transition={{ duration: 0.45, ease: EASE }}
            >
              <blockquote>“{quote}”</blockquote>
              <p>
                {name ? `${name} · ` : ""}
                {role}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="review-footer">
          <div className="review-controls">
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous testimonial"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next testimonial"
            >
              →
            </button>
          </div>
          <div className="testimonial-dots" role="tablist" aria-label="Choose testimonial">
            {reviews.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Testimonial ${i + 1}`}
                className={`testimonial-dot ${i === index ? "active" : ""}`}
                onClick={() => {
                  setDirection(i >= index ? 1 : -1);
                  setIndex(i);
                }}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
