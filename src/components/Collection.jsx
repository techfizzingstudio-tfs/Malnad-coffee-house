import React from "react";
import products from "../data/products.json";
import lots from "../data/lots.json";
import roasts from "../data/roasts.json";
import { Action, Arrow, Intro, SiteLink } from "./Shell";
import {
  AnimatedMeter,
  FadeUp,
  ParallaxImage,
  RevealMask,
  StaggerGroup,
  StaggerItem,
} from "./Motion";

export function Collection({ featured = false }) {
  const items = featured ? [products[0], products[1], products[3]] : products;
  return (
    <section className="wrap">
      <div className="sectionhead">
        <div>
          <RevealMask className="label">The collection</RevealMask>
          <h2>
            <RevealMask delay={0.06} as="span">
              {featured ? "Our coffee range" : "Find your coffee"}
            </RevealMask>
          </h2>
        </div>
        {featured && (
          <FadeUp delay={0.12}>
            <SiteLink className="textlink" href="/product">
              View all coffees <Arrow />
            </SiteLink>
          </FadeUp>
        )}
      </div>
      <StaggerGroup className="grid" stagger={0.09}>
        {items.map((p) => (
          <StaggerItem as="article" className="card" key={p.title}>
            <SiteLink
              className="photo"
              href={featured ? "/product" : p.links[0][0]}
            >
              <ParallaxImage
                src={p.image}
                alt={p.title}
                variant="default"
                intensity={9}
              />
            </SiteLink>
            <h3>{p.title}</h3>
            <p>{p.description}</p>
            {!featured && (
              <div className="links">
                {p.links.map(([url, text]) => (
                  <SiteLink key={url} href={url}>
                    {text.replace("→", "").trim()} <Arrow />
                  </SiteLink>
                ))}
              </div>
            )}
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  );
}

export function Catalog() {
  return (
    <>
      <div className="split">
        <div>
          <Intro label="Featured blend" title="Signature Espresso Blend">
            High-grown Arabica sweetness and dense Robusta crema. A medium-dark
            roast with dark chocolate notes, developed for commercial espresso
            machines.
          </Intro>
          <FadeUp immediate delay={0.2}>
            <Action href="/horeca">Enquire for your café</Action>
          </FadeUp>
        </div>
        <ParallaxImage
          src="/img/signature-espresso-blend.jfif"
          alt="Signature Espresso Blend"
          variant="split"
          intensity={12}
          priority
        />
      </div>
      <Collection />
      <section className="wrap selections">
        <RevealMask className="label">Estate selections</RevealMask>
        <h2>
          <RevealMask delay={0.06} as="span">
            Blends and retail packs
          </RevealMask>
        </h2>
        <StaggerGroup className="grid" stagger={0.1}>
          {lots.map((lot) => (
            <StaggerItem as="article" key={lot.title} className="card lot-card">
              <ParallaxImage
                src={lot.image}
                alt={lot.title}
                variant="arch-card"
                intensity={9}
              />
              <h3>{lot.title}</h3>
              <p>{lot.description}</p>
              <div className="lot-specs">
                {lot.specs.map((spec) => (
                  <span className="lot-chip" key={spec}>
                    {spec}
                  </span>
                ))}
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>
      <section className="trade wrap">
        <RevealMask className="label">Roast guide</RevealMask>
        <h2>
          <RevealMask delay={0.06} as="span">
            Choose a profile
          </RevealMask>
        </h2>
        <StaggerGroup className="grid" stagger={0.1}>
          {roasts.map((r) => (
            <StaggerItem as="article" className="roast-card" key={r.roast}>
              <div className="label">{r.roast}</div>
              <h3>{r.name}</h3>
              <p>{r.description}</p>
              <div className="meter-group">
                {r.values.map(([label, value], i) => (
                  <AnimatedMeter
                    key={label}
                    label={label}
                    value={value}
                    delay={i * 0.1}
                  />
                ))}
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>
    </>
  );
}
