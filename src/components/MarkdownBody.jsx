import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { HairlineRule } from "./Motion";

function safeUrl(url, key) {
  const value = typeof url === "string" ? url.trim() : "";
  if (!value) return "";
  if (key === "src") {
    return /^(https:\/\/|\/img\/)/i.test(value) ? value : "";
  }
  if (key === "href") {
    return /^(https?:\/\/|mailto:|#|\/(?!\/))/i.test(value) ? value : "";
  }
  return "";
}

const markdownComponents = {
  h1: ({ node, children, ...props }) => <h2 {...props}>{children}</h2>,
  a: ({ node, href, children, ...props }) => {
    if (!href) return <span>{children}</span>;
    const isExternal = /^https?:\/\//i.test(href);
    return (
      <a
        href={href}
        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...props}
      >
        {children}
      </a>
    );
  },
  img: ({ node, src, alt, ...props }) => {
    if (!src) return null;
    return (
      <img
        src={src}
        alt={alt || ""}
        loading="lazy"
        className="md-image"
        {...props}
      />
    );
  },
  hr: () => <HairlineRule className="md-rule" />,
  table: ({ node, children, ...props }) => (
    <div className="md-table-wrap">
      <table {...props}>{children}</table>
    </div>
  ),
};

export function MarkdownBody({ content = "", className = "" }) {
  return (
    <div className={`markdown-body ${className}`.trim()}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        urlTransform={safeUrl}
        components={markdownComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export function parseMarkdownFile(rawText) {
  const text = typeof rawText === "string" ? rawText : "";
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    return { meta: {}, body: text };
  }

  const meta = {};
  const lines = match[1].split(/\r?\n/);
  for (const line of lines) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim().toLowerCase();
    if (!["title", "summary", "image", "slug"].includes(key)) continue;
    let val = line.slice(idx + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (val) meta[key] = val;
  }

  return { meta, body: match[2] };
}
