import { createHash, timingSafeEqual } from "node:crypto";
const { ADMIN_TOKEN } = process.env;
import { database, databaseConfigured } from "../../lib/database.js";

const digest = (value) => createHash("sha256").update(value).digest();
function reply(body, status) {
  return new Response(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}

export async function POST({ request }) {
  if (!ADMIN_TOKEN || !databaseConfigured)
    return reply("Publishing needs server configuration.", 503);
  const authorization = request.headers.get("authorization") || "";
  if (
    !timingSafeEqual(digest(authorization), digest("Bearer " + ADMIN_TOKEN))
  ) {
    return reply("Check the admin token.", 401);
  }

  const { kind, slug, ...fields } =
    (await request.json().catch(() => null)) ?? {};
  const names =
    kind === "posts"
      ? ["title", "summary", "body"]
      : kind === "faqs"
        ? ["question", "answer"]
        : [];
  if (
    !names.length ||
    typeof slug !== "string" ||
    slug.length > 120 ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ||
    names.some(
      (name) => typeof fields[name] !== "string" || !fields[name].trim(),
    )
  ) {
    return reply("Check the identifier and required fields.", 400);
  }
  const entry = Object.fromEntries(
    names.map((name) => [name, fields[name].trim()]),
  );
  if (kind === "posts") {
    // Leading spaces can define an indented Markdown code block.
    entry.body = fields.body;
    entry.bodyFormat = "markdown";
  }
  const image = typeof fields.image === "string" ? fields.image.trim() : "";
  if (kind === "posts" && image) {
    if (!/^(https:\/\/|\/img\/)/.test(image))
      return reply("Use an HTTPS image URL or /img/ path.", 400);
    entry.image = image;
  }
  try {
    const db = await database();
    await db
      .collection(kind)
      .replaceOne(
        { _id: slug },
        { ...entry, updatedAt: new Date() },
        { upsert: true },
      );
  } catch {
    return reply("Database save failed. Retry publishing.", 503);
  }
  return reply(
    "Published. The update is visible on the next page request.",
    200,
  );
}
