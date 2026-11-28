import React, { useRef, useState } from "react";
import { Action, Intro, Arrow, SiteLink } from "./Shell";
import {
  AccordionItem,
  FadeUp,
  ParallaxImage,
  StaggerGroup,
  StaggerItem,
} from "./Motion";
import { MarkdownBody, parseMarkdownFile } from "./MarkdownBody";

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
      {post?.body && (
        <FadeUp delay={0.08} y={16}>
          <MarkdownBody content={post.body} />
        </FadeUp>
      )}
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

const toolbarActions = [
  { id: "h2", label: "H2", title: "Heading 2", type: "line", prefix: "## " },
  { id: "h3", label: "H3", title: "Heading 3", type: "line", prefix: "### " },
  { id: "bold", label: "B", title: "Bold", type: "wrap", before: "**", after: "**", placeholder: "bold text" },
  { id: "italic", label: "I", title: "Italic", type: "wrap", before: "*", after: "*", placeholder: "italic text" },
  { id: "quote", label: "“", title: "Blockquote", type: "line", prefix: "> " },
  { id: "list", label: "• List", title: "Bullet list", type: "line", prefix: "- " },
  { id: "link", label: "Link", title: "Insert link", type: "wrap", before: "[", after: "](https://)", placeholder: "link text" },
  { id: "img", label: "Img", title: "Insert image", type: "insert", snippet: "![Coffee image](/img/where-coffee-grows03.webp)" },
  { id: "code", label: "</>", title: "Code block", type: "wrap", before: "```\n", after: "\n```", placeholder: "code" },
];

export function Admin() {
  const [kind, setKind] = useState("posts");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [image, setImage] = useState("");
  const [body, setBody] = useState("");
  const [mode, setMode] = useState("write");

  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  function applyFormat(action) {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart ?? body.length;
    const end = el.selectionEnd ?? body.length;
    const selected = body.slice(start, end);

    let next = body;
    let nextStart = start;
    let nextEnd = end;

    if (action.type === "line") {
      const lineStart = body.lastIndexOf("\n", start - 1) + 1;
      const before = body.slice(0, lineStart);
      const block = body.slice(lineStart, end);
      const after = body.slice(end);
      const updatedBlock = block
        .split("\n")
        .map((line) => (line.startsWith(action.prefix) ? line : action.prefix + line))
        .join("\n");
      next = before + updatedBlock + after;
      const delta = updatedBlock.length - block.length;
      nextStart = start + action.prefix.length;
      nextEnd = end + delta;
    } else if (action.type === "wrap") {
      const inner = selected || action.placeholder;
      const replacement = action.before + inner + action.after;
      next = body.slice(0, start) + replacement + body.slice(end);
      nextStart = start + action.before.length;
      nextEnd = nextStart + inner.length;
    } else if (action.type === "insert") {
      next = body.slice(0, start) + action.snippet + body.slice(end);
      nextStart = start + action.snippet.length;
      nextEnd = nextStart;
    }

    setBody(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(nextStart, nextEnd);
    });
  }

  async function importMarkdown(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const raw = await file.text();
      const { meta, body: importedBody } = parseMarkdownFile(raw);
      setBody(importedBody);
      if (meta.title && !title.trim()) setTitle(meta.title);
      if (meta.summary && !summary.trim()) setSummary(meta.summary);
      if (meta.image && !image.trim()) setImage(meta.image);
      if (!slug.trim()) {
        const derivedSlug =
          meta.slug ||
          file.name
            .replace(/\.(md|markdown|txt)$/i, "")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")
            .slice(0, 120);
        if (derivedSlug) setSlug(derivedSlug);
      }
      setMode("write");
      setStatus(`Loaded ${file.name}.`);
    } catch {
      setStatus("Could not read the selected Markdown file.");
    }
  }

  async function publish(event) {
    event.preventDefault();
    const formData = Object.fromEntries(new FormData(event.currentTarget));
    const token = formData.token || "";

    if (kind === "posts" && !body.trim()) {
      setMode("write");
      setStatus("Please write or import Markdown content for the article.");
      return;
    }

    const payload =
      kind === "posts"
        ? { kind, slug, title, summary, image, body }
        : {
            kind,
            slug,
            question: formData.question || "",
            answer: formData.answer || "",
          };

    setBusy(true);
    setStatus("Publishing…");
    try {
      const response = await fetch("/api/publish", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
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
            <option value="posts">Blog post (Markdown)</option>
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
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
        </label>
        <small>Use an existing identifier to replace that entry.</small>
        {kind === "posts" ? (
          <fieldset key="posts">
            <label>
              Title
              <input
                name="title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>
            <label>
              Summary
              <textarea
                name="summary"
                required
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
            </label>
            <label>
              Cover image URL
              <input
                name="image"
                placeholder="/img/where-coffee-grows03.webp or https://..."
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
            </label>
            <div className="md-editor">
              <div className="md-editor-head">
                <span className="md-editor-label">Article (Markdown / .md)</span>
                <div className="md-editor-controls">
                  <div className="md-tabs" role="group" aria-label="Editor mode">
                    <button
                      type="button"
                      className={`md-tab ${mode === "write" ? "is-active" : ""}`}
                      aria-pressed={mode === "write"}
                      onClick={() => setMode("write")}
                    >
                      Write
                    </button>
                    <button
                      type="button"
                      className={`md-tab ${mode === "preview" ? "is-active" : ""}`}
                      aria-pressed={mode === "preview"}
                      onClick={() => setMode("preview")}
                    >
                      Preview
                    </button>
                  </div>
                  <button
                    type="button"
                    className="md-upload-btn"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Import .md file
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".md,.markdown,text/markdown,text/plain"
                    className="md-file-input"
                    onChange={importMarkdown}
                  />
                </div>
              </div>

              {mode === "write" ? (
                <>
                  <div
                    className="md-toolbar"
                    role="toolbar"
                    aria-label="Markdown formatting"
                  >
                    {toolbarActions.map((action) => (
                      <button
                        key={action.id}
                        type="button"
                        title={action.title}
                        onClick={() => applyFormat(action)}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                  <textarea
                    ref={textareaRef}
                    name="body"
                    className="md-textarea"
                    rows={12}
                    required
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder={
                      "## Brewing notes\n\nWrite your article in **Markdown** — headings, lists, blockquotes, links, tables, and `/img/...` images are supported."
                    }
                  />
                </>
              ) : (
                <div className="md-preview">
                  {body.trim() ? (
                    <MarkdownBody content={body} />
                  ) : (
                    <p className="md-empty">
                      Nothing to preview yet — write Markdown or import a `.md`
                      file.
                    </p>
                  )}
                </div>
              )}
              <small className="md-hint">
                Supports GitHub-Flavored Markdown (`#` headings, `**bold**`,
                `*italic*`, `&gt;` quotes, lists, tables, links, and `https://` or
                `/img/` images). Optional YAML frontmatter in `.md` files fills
                title, summary, image, and slug automatically.
              </small>
            </div>
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
