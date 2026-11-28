import React, { useState } from "react";
import { Action, Intro, Arrow, SiteLink } from "./Shell";
import {
  AccordionItem,
  FadeUp,
  ParallaxImage,
  StaggerGroup,
  StaggerItem,
} from "./Motion";

function EditorialNotice() {
  return (
    <p role="status">
      Some published content is temporarily unavailable. Please check back
      later.
    </p>
  );
}

export function Journal({ posts, unavailable }) {
  return (
    <section className="wrap">
      <Intro label="The journal" title="Coffee field notes">
        Brewing methods, roasting insights and stories from the coffee trade.
      </Intro>
      {unavailable && <EditorialNotice />}
      <StaggerGroup className="grid" stagger={0.09}>
        {posts.map((p) => (
          <StaggerItem as="article" key={p._id} className="card">
            <SiteLink href={"/blog/" + p._id} className="photo">
              <ParallaxImage
                src={p.image || "/img/where-coffee-grows03.webp"}
                alt=""
                variant="default"
                intensity={8}
              />
            </SiteLink>
            <h3>
              <SiteLink href={"/blog/" + p._id}>{p.title}</SiteLink>
            </h3>
            <p>{p.summary}</p>
            <SiteLink className="textlink" href={"/blog/" + p._id}>
              Read article <Arrow />
            </SiteLink>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  );
}

export function Article({ post, unavailable }) {
  return (
    <article className="reading wrap">
      <SiteLink className="textlink" href="/blog">
        ← Journal
      </SiteLink>
      <Intro
        label="Coffee journal"
        title={post?.title ?? "Article temporarily unavailable"}
      >
        {post?.summary ?? "Please try again later."}
      </Intro>
      {unavailable && <EditorialNotice />}
      {post?.image && (
        <ParallaxImage
          src={post.image}
          alt=""
          variant="cover"
          intensity={12}
          priority
        />
      )}
      {post?.body.split(/\n\s*\n/).map((p, i) => (
        <FadeUp key={i} delay={Math.min(i * 0.04, 0.2)} y={16}>
          <p>{p}</p>
        </FadeUp>
      ))}
    </article>
  );
}

export function Faqs({ items, unavailable }) {
  return (
    <section className="reading wrap">
      <Intro label="Customer enquiries" title="Frequently asked questions" />
      {unavailable && <EditorialNotice />}
      <div className="accordion-list">
        {items.map((f) => (
          <AccordionItem key={f._id} question={f.question} answer={f.answer} />
        ))}
      </div>
      <div className="actions">
        <Action href="/contact">Ask us a question</Action>
      </div>
    </section>
  );
}

export function Admin() {
  const [kind, setKind] = useState("posts"),
    [status, setStatus] = useState(""),
    [busy, setBusy] = useState(false);
  async function publish(event) {
    event.preventDefault();
    const { token, ...fields } = Object.fromEntries(
      new FormData(event.currentTarget),
    );
    setBusy(true);
    setStatus("Publishing…");
    try {
      const response = await fetch("/api/publish", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...fields, kind }),
      });
      setStatus(await response.text());
    } catch {
      setStatus("Connection failed. Retry with the same identifier.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="reading wrap">
      <Intro label="Administration" title="Publishing desk" />
      <form onSubmit={publish}>
        <label>
          Admin token
          <input
            name="token"
            type="password"
            autoComplete="current-password"
            required
          />
        </label>
        <label>
          Content type
          <select value={kind} onChange={(e) => setKind(e.target.value)}>
            <option value="posts">Blog post</option>
            <option value="faqs">FAQ</option>
          </select>
        </label>
        <label>
          Identifier
          <input
            name="slug"
            required
            maxLength={120}
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            placeholder="how-to-brew-coffee"
          />
        </label>
        <small>Use an existing identifier to replace that entry.</small>
        {kind === "posts" ? (
          <fieldset key="posts">
            <label>
              Title
              <input name="title" required />
            </label>
            <label>
              Summary
              <textarea name="summary" required />
            </label>
            <label>
              Cover image URL
              <input name="image" />
            </label>
            <label>
              Article
              <textarea name="body" rows="9" required />
            </label>
          </fieldset>
        ) : (
          <fieldset key="faqs">
            <label>
              Question
              <input name="question" required />
            </label>
            <label>
              Answer
              <textarea name="answer" rows="5" required />
            </label>
          </fieldset>
        )}
        <button className="button" disabled={busy}>
          Publish <Arrow />
        </button>
        <p role="status">{status}</p>
      </form>
    </section>
  );
}
