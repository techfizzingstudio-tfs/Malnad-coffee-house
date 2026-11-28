import { database, databaseConfigured } from "../../lib/database.js";
import defaults from "../editorial/faqs.json";

import starterPosts from "../data/posts.json";
const starterFaqs = defaults.items.map((faq, index) => ({
  _id: "faq-" + (index + 1),
  ...faq,
}));

async function readCollection(collection, read) {
  if (!databaseConfigured) return { data: null, unavailable: false };
  try {
    const db = await database();
    return { data: await read(db.collection(collection)), unavailable: false };
  } catch (error) {
    console.error("MongoDB editorial read failed", {
      collection,
      name: error.name,
      code: error.code,
    });
    return { data: null, unavailable: true };
  }
}

async function published(collection, starters) {
  const { data, unavailable } = await readCollection(collection, (entries) =>
    entries.find().sort({ updatedAt: 1 }).toArray(),
  );
  const entries = new Map(starters.map((entry) => [entry._id, entry]));
  for (const entry of data ?? []) entries.set(entry._id, entry);
  return { entries: [...entries.values()], unavailable };
}
export const posts = () => published("posts", starterPosts);
export const faqs = () => published("faqs", starterFaqs);

export async function post(slug) {
  const { data, unavailable } = await readCollection("posts", (entries) =>
    entries.findOne({ _id: slug }),
  );
  return {
    entry: data ?? starterPosts.find((entry) => entry._id === slug) ?? null,
    unavailable,
  };
}
