import { createServerFn } from "@tanstack/react-start";
import { setResponseHeader } from "@tanstack/react-start/server";
import { posts, post, faqs } from "../server/editorial";

export const readPosts = createServerFn().handler(async () => {
  setResponseHeader("Cache-Control", "no-store");
  const { entries, unavailable } = await posts();
  return {
    posts: entries.reverse().map(({ _id, title, image, summary }) => ({
      _id,
      title,
      image,
      summary,
    })),
    unavailable,
  };
});
export const readPost = createServerFn()
  .validator((slug) => {
    if (typeof slug !== "string") throw new Error("Invalid slug");
    return slug;
  })
  .handler(async ({ data }) => {
    setResponseHeader("Cache-Control", "no-store");
    const { entry, unavailable } = await post(data);
    if (!entry) return { entry: null, unavailable };
    const { _id, title, summary, image, body } = entry;
    return { entry: { _id, title, summary, image, body }, unavailable };
  });
export const readFaqs = createServerFn().handler(async () => {
  setResponseHeader("Cache-Control", "no-store");
  const { entries, unavailable } = await faqs();
  return {
    items: entries.map(({ _id, question, answer }) => ({
      _id,
      question,
      answer,
    })),
    unavailable,
  };
});
